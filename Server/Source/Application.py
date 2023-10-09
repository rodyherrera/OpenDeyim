# * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
# * Licensed under the MIT license. See LICENSE file in the project root
# * for full license information.
# *
# * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
# *
# * The OpenDeyim Source Code
# * A free, modern, self-hosted and open source translation service that instantly 
# * translates phrases, words and web pages into more than 30 languages. Use our 
# * API or bindings and experiment with OpenDeyim.
# * 
# * For more information, please read the documentation inside 
# * the <README.md> file which is located at the root of this directory or source code.
# * 
# * Consider that, OpenDeyim, has parts of the LibreTranslate source code, despite 
# * the fact that it has been rewritten from scratch, removing functionalities from the 
# * original backend, reducing it to only one API under Flask, however, OpenDeyim, as 
# * of its publication, is completely misaligned With updates or implementations that 
# * LibreTranslate eventually receives, OpenDeyim does not claim to be a copy of it.
# * 
# * (www.github.com/codewithrodi/OpenDeyim/)
# * 
# * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
# * Full Stack Software Developer.
# *
# * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

from functools import wraps
from html import unescape
from translatehtml import translate_html
from Source import Flood
from Source.Language import DetectLanguages, ImproveTranslationFormatting
from flask import (
    abort,
    Blueprint,
    Flask,
    jsonify,
    request,
    Response
)

def GetJSONDict(Request) -> dict:
    MaybeDict = Request.get_json()
    if not isinstance(MaybeDict, dict):
        abort(400, description = 'Invalid JSON format')
    return MaybeDict

def GetRemoteAddress() -> str:
    if request.headers.getlist('X-Forwarded-For'):
        IP = request.headers.getlist('X-Forwarded-For')[0].split(',')[0]
    else:
        IP = request.remote_addr or '127.0.0.1'
    return IP

def CreateApplication(Arguments):
    from Source.Init import Boot
    Boot(Arguments.LoadOnly, Arguments.UpdateModels)
    from Source.Language import LoadLanguages
    BP = Blueprint('Main APP', __name__)
    Languages = LoadLanguages()
    LanguagePairs = {}
    for Language in Languages:
        LanguagePairs[Language.code] = sorted([Lang.to_lang.code for Lang in Language.translations_from])
    if Arguments.FrontendLanguageSource == 'auto':
        FrontendArgosLanguageSource = type(
            'obj', (object, ), { 'code': 'auto', 'name': 'Auto Detect' })
    else:
        FrontendArgosLanguageSource = next(
            iter([ Lang for Lang in Languages if Lang.code == Arguments.FrontendLanguageSource ]),
            None)
    FrontendArgosLanguageTarget = next(
        iter([ Lang for Lang in Languages if Lang.code == Arguments.FrontendLanguageTarget ]), None)
    if FrontendArgosLanguageSource is None:
        FrontendArgosLanguageSource = Languages[0]
    if FrontendArgosLanguageTarget is None:
        if len(Languages) >= 2:
            FrontendArgosLanguageTarget = Languages[1]
        else:
            FrontendArgosLanguageTarget = Languages[0]
    if Arguments.RequestFloodThreshold > 0:
        Flood.Setup(Arguments.RequestFloodThreshold)
    
    def AccessCheck(F):
        @wraps(F)
        def Function(*Arguments, **KeywordArguments):
            IP = GetRemoteAddress()
            if Flood.IsBanned(IP):
                abort(403, description = 'Too many request limits violations')
            return F(*Arguments, **KeywordArguments)
        return Function
    
    @BP.errorhandler(400)
    def InvalidAPI(Error):
        return jsonify({ 
            'Status': 'Error',
            'Message': str(Error.description)
        }), 400

    @BP.errorhandler(500)
    def ServerError(Error):
        return jsonify({
            'Status': 'Error',
            'Message': str(Error.description) 
        }), 500

    @BP.errorhandler(429)
    def SlowDownError(Error):
        Flood.Report(GetRemoteAddress())
        return jsonify({ 
            'Status': 'Error',
            'Message': 'Slowdown: ' + str(Error.description) 
        }), 429
    
    @BP.errorhandler(403)
    def Denied(Error):
        return jsonify({ 
            'Status': 'Error',
            'Message': str(Error.description) 
        }), 403

    @BP.get('/languages')
    def AvailableLanguages():
        return jsonify({
            'Status': 'Success',
            'Data': [{
                'Code': Language.code,
                'Targets': LanguagePairs.get(Language.code, [])
            } for Language in Languages]
        })
    
    @BP.after_request
    def AfterRequest(Response):
        Response.headers.add('Access-Control-Allow-Origin', '*')
        Response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        Response.headers.add('Access-Control-Expose-Headers', 'Authorization')
        Response.headers.add('Access-Control-Allow-Methods', 'GET, POST')
        Response.headers.add('Access-Control-Allow-Credentials', 'true')
        Response.headers.add('Access-Control-Max-Age', 60 * 60 * 24 * 20)
        return Response

    @BP.post('/translate')
    def Translate():
        JSON = GetJSONDict(request)
        Query = JSON.get('Query')
        SourceLanguage = JSON.get('Source')
        TargetLanguage = JSON.get('Target')
        TextFormat = JSON.get('Format')
        if not Query:
            abort(400, description = 'Invalid request: Missing "Query" parameter')
        if not SourceLanguage:
            abort(400, description = 'Invalid request: Missing "Source" parameter')
        if not TargetLanguage:
            abort(400, description = 'Invalid request: Missing "Target" parameter')
        Batch = isinstance(Query, list)
        if Batch and Arguments.BatchLimit != -1:
            BatchSize = len(Query)
            if Arguments.BatchLimit < BatchSize:
                abort(400, description = 'Invalid request: Request (%d) exceeds text limit (%d)' % (BatchSize, Arguments.BatchLimit))
        if Arguments.CharacterLimit != -1:
            if Batch:
                Characters = sum([len(Text) for Text in Query])
            else:
                Characters = len(Query)
            if Arguments.CharacterLimit < Characters:
                abort(400, description = 'Invalid request: Request (%d) exceeds character limit (%d)' % (Characters, Arguments.CharacterLimit))
        if SourceLanguage == 'auto':
            SourceLanguages = []
            if Batch:
                AutoDetectTexts = Query
            else:
                AutoDetectTexts = [Query]
            OverallCandidates = DetectLanguages(Query)
            for TextToCheck in AutoDetectTexts:
                if len(TextToCheck) > 40:
                    CandidateLanguages = DetectLanguages(TextToCheck)
                else:
                    CandidateLanguages = OverallCandidates
                SourceLanguages.append(CandidateLanguages[0])
                if Arguments.Debug:
                    print(TextToCheck, CandidateLanguages)
                    print(':-: Auto detected: %s' % CandidateLanguages[0]['Language'])
        else:
            if Batch:
                SourceLanguages = [{
                    'Confidence': 100.0,
                    'Language': SourceLanguage
                } for Text in Query]
            else:
                SourceLanguages = [{
                    'Confidence': 100.0,
                    'Language': SourceLanguage
                }]
        AuxiliarSourceLanguages = [next(iter([
            Language for Language in Languages if Language.code == SourceLanguage['Language'] ]), None) 
            for SourceLanguage in SourceLanguages]
        for Idx, Language in enumerate(AuxiliarSourceLanguages):
            if Language is None:
                abort(400, description = '%s is not supported' % TargetLanguage)
        TargetLanguage = next(iter([ Language for Language in Languages if Language.code == TargetLanguage ]), None)
        if TargetLanguage is None:
            abort(400, description = '%s is not supported' % TargetLanguage)
        if not TextFormat:
            TextFormat = 'text'
        if TextFormat not in ['text', 'html']:
            abort(400, description = '%s format is not supported' % TextFormat)
        try:
            if Batch:
                Results = []
                for Idx, Text in enumerate(Query):
                    Translator = AuxiliarSourceLanguages[Idx].get_translation(TargetLanguage)
                    if Translator is None:
                        abort(400, description = '%s (%s) is not available as a target language from %s (%s)' % (
                            TargetLanguage.name, TargetLanguage.code, AuxiliarSourceLanguages[Idx].name, AuxiliarSourceLanguages[Idx].code))
                    if TextFormat == 'html':
                        TranslatedText = str(translate_html(Translator, Text))
                    else:
                        TranslatedText = ImproveTranslationFormatting(Text, Translator.translate(Text))
                    Results.append(unescape(TranslatedText))
                if SourceLanguage == 'auto':
                    return jsonify({
                        'Status': 'Success',
                        'Data': {
                            'TranslatedText': Results,
                            'DetectedLanguage': SourceLanguages
                        }
                    })
                else:
                    return jsonify({
                        'Status': 'Success',
                        'Data': {
                            'TranslatedText': Results
                        }
                    })
            else:
                Translator = AuxiliarSourceLanguages[0].get_translation(TargetLanguage)
                if Translator is None:
                    abort(400, description = '%s (%s) is not available as a target language from %s (%s)' % (
                        TargetLanguage.name, TargetLanguage.code, AuxiliarSourceLanguages[0].name, AuxiliarSourceLanguages[0].code))
                if TextFormat == 'html':
                    TranslatedText = str(translate_html(Translator, Query))
                else:
                    TranslatedText = ImproveTranslationFormatting(Query, Translator.translate(Query))
                if SourceLanguage == 'auto':
                    return jsonify({
                        'Status': 'Success',
                        'Data': {
                            'TranslatedText': unescape(TranslatedText),
                            'DetectedLanguage': SourceLanguages[0]
                        }
                    })
                else:
                    return jsonify({
                        'Status': 'Success',
                        'Data': {
                            'TranslatedText': unescape(TranslatedText)
                        }
                    })
        except Exception as Error:
            abort(500, description = 'Cannot translate text: %s' % str(Error))
    
    @BP.post('/detect')
    @AccessCheck
    def Detect():
        if Flood.IsBanned(GetRemoteAddress()):
            abort(403, description = 'Too many request limits violations.')
        if request.is_json:
            JSON = GetJSONDict(request)
            Query = JSON.get('Query')
        else:
            Query = request.values.get('Query')
        if not Query:
            abort(400, description = 'Invalid request: Missing "Query" parameter.')
        return jsonify({
            'Status': 'Success',
            'Data': DetectLanguages(Query)
        })
    
    @BP.route('/')
    def FrontendSettings():
        return jsonify({
            'Status': 'Success',
            'Data': {
                'CharacterLimit': Arguments.CharacterLimit,
                'FrontendTimeout': Arguments.FrontendTimeout,
                'Language': {
                    'Source': {
                        'Code': FrontendArgosLanguageSource.code,
                        'Name': FrontendArgosLanguageSource.name
                    },
                    'Target': {
                        'Code': FrontendArgosLanguageTarget.code,
                        'Name': FrontendArgosLanguageTarget.name
                    }
                }
            }
        })

    Application = Flask(__name__)
    if Arguments.URLPrefix:
        Application.register_blueprint(BP, url_prefix = Arguments.URLPrefix)
    else:
        Application.register_blueprint(BP)
    return Application