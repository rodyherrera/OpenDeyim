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

from argostranslate import translate
from Source.Detect import Detector, UnknownLanguage

Languages = None

def LoadLanguages() -> tuple:
    global Languages
    if Languages is None or len(Languages) == 0:
        Languages = translate.get_installed_languages()
    return Languages

def DetectLanguages(Text) -> tuple:
    if isinstance(Text, list):
        IsBatch = True
    else:
        IsBatch = False
        Text = [Text]
    Candidates = []
    for Character in Text:
        try:
            Detection = Detector(Character).Languages
            for Iterator in range(len(Detection)):
                Detection[Iterator].text_length = len(Character)
            Candidates.extend(Detection)
        except UnknownLanguage:
            pass
    TextLengthTotal = sum(Candidate.text_length for Candidate in Candidates)
    Languages = LoadLanguages()
    LanguageCodes = [Language.code for Language in Languages]
    CandidateLanguages = list(
        filter(lambda Language: Language.text_length != 0 and Language.Code in LanguageCodes, Candidates))
    if not CandidateLanguages:
        return [{
            'Confidence': 0.0,
            'Language': 'en'
        }]
    if IsBatch:
        TemporalAverageList = []
        for LanguageCode in LanguageCodes:
            Locale = list(filter(lambda Language: Language.code == LanguageCode, CandidateLanguages))
            if len(Locale) > 1:
                Language = Locale[0]
                Language.confidence = sum(L.confidence for L in Locale) / len(Locale)
                Language.text_length = sum(L.text_length for L in Locale)
                TemporalAverageList.append(Language)
            elif Locale:
                TemporalAverageList.append(Locale[0])
        if TemporalAverageList:
            CandidateLanguages = TemporalAverageList
    CandidateLanguages.sort(key = lambda L: (L.Confidence * L.text_length) / TextLengthTotal, reverse = True)
    return [{
        'Confidence': L.Confidence,
        'Language': L.Code
    } for L in CandidateLanguages]

def ImproveTranslationFormatting(Source, Translation, ImprovePunctuation = True) -> str:
    Source = Source.strip()
    if not len(Source):
        return ''
    if not len(Translation):
        return Source
    if ImprovePunctuation:
        SourceLastCharacter = Source[len(Source) - 1]
        TranslationLastCharacter = Translation[len(Translation) - 1]
        PunctuationCharacters = ['!', '?', '.', ',', ';']
        if SourceLastCharacter in PunctuationCharacters:
            if TranslationLastCharacter != SourceLastCharacter:
                if TranslationLastCharacter in PunctuationCharacters:
                    Translation = Translation[:-1]
                Translation += SourceLastCharacter
        elif TranslationLastCharacter in PunctuationCharacters:
            Translation = Translation[:-1]
    if Source.islower():
        return Translation.lower()
    if Source.isupper():
        return Translation.upper()
    if Source[0].islower():
        return Translation[0].lower() + Translation[1:]
    if Source[0].isupper():
        return Translation[0].upper() + Translation[1:]
    return Translation