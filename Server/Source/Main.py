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

import argparse, operator, sys
from Source.Application import CreateApplication
from Source.DefaultValues import DEFAULT_ARGUMENTS

def GetArguments():
    Parser = argparse.ArgumentParser(
        description = 'OpenDeyim - Free and Open Source Translation API')
    Parser.add_argument(
        '--Host',
        type = str,
        help = 'Hostname (%(default)s)',
        default = DEFAULT_ARGUMENTS['HOST']
    )
    Parser.add_argument(
        '--Port',
        type = int,
        help = 'Por (%(default)s)',
        default = DEFAULT_ARGUMENTS['PORT']
    )
    Parser.add_argument(
        '--CharacterLimit',
        default = DEFAULT_ARGUMENTS['CHARACTER_LIMIT'],
        type = int,
        metavar = '<number of characters>',
        help = 'Set character limit (%(default)s)'
    )
    Parser.add_argument(
        '--RequestFloodThreshold',
        default = DEFAULT_ARGUMENTS['REQUEST_FLOOD_THRESHOLD'],
        type = int,
        metavar = '<number>',
        help = 'Set the maximum number of request limit offences that a client can exceed before being banned. (%(default)s)',
    )
    Parser.add_argument(
        '--BatchLimit',
        default = DEFAULT_ARGUMENTS['BATCH_LIMIT'],
        type = int,
        metavar = '<number of texts>',
        help = 'Set maximum number of texts to translate in a batch request (%(default)s)',
    )
    Parser.add_argument(
        '--Debug', 
        default = DEFAULT_ARGUMENTS['DEBUG'], 
        action = 'store_true', 
        help = 'Enable Debug environment'
    )
    Parser.add_argument(
        '--SSL', 
        default = DEFAULT_ARGUMENTS['SSL'], 
        action = 'store_true', 
        help = 'Whether to enable SSL'
    )
    Parser.add_argument(
        '--FrontendLanguageSource',
        type = str,
        default = DEFAULT_ARGUMENTS['FRONTEND_LANGUAGE_SOURCE'],
        metavar = '<language code>',
        help = 'Set frontend default language - source (%(default)s)',
    )
    Parser.add_argument(
        '--FrontendLanguageTarget',
        type = str,
        default = DEFAULT_ARGUMENTS['FRONTEND_LANGUAGE_TARGET'],
        metavar = '<language code>',
        help = 'Set frontend default language - target (%(default)s)',
    )
    Parser.add_argument(
        '--FrontendTimeout',
        type = int,
        default = DEFAULT_ARGUMENTS['FRONTEND_TIMEOUT'],
        metavar = '<milliseconds>',
        help = 'Set frontend translation timeout (%(default)s)',
    )
    Parser.add_argument(
        '--LoadOnly',
        type = operator.methodcaller('split', ','),
        default = DEFAULT_ARGUMENTS['LOAD_ONLY'],
        metavar = '<comma-separated language codes>',
        help = 'Set available languages (ar,de,en,es,fr,ga,hi,it,ja,ko,pt,ru,zh)',
    )
    Parser.add_argument(
        '--Threads',
        default = DEFAULT_ARGUMENTS['THREADS'],
        type = int,
        metavar = '<number of threads>',
        help = 'Set number of threads (%(default)s)',
    )
    Parser.add_argument(
        '--UpdateModels', 
        default = DEFAULT_ARGUMENTS['UPDATE_MODELS'],
        action = 'store_true', 
        help = 'Update language models at startup'
    )
    Parser.add_argument(
        '--URLPrefix',
        default = DEFAULT_ARGUMENTS['URL_PREFIX'],
        type = str,
        help = 'Add prefix to URL: example.com:5000/URLPrefix/',
    )
    Arguments = Parser.parse_args()
    if Arguments.URLPrefix and not Arguments.URLPrefix.startswith('/'):
        Arguments.URLPrefix = '/' + Arguments.URLPrefix
    return Arguments

def Main() -> None:
    Arguments = GetArguments()
    Application = CreateApplication(Arguments)
    if '--wsgi' in sys.argv:
        return Application
    else:
        if Arguments.Debug:
            Application.run(host = Arguments.Host, port = Arguments.Port)
        else:
            from waitress import serve
            URLScheme = 'https' if Arguments.SSL else 'http'
            print(':-: Running on %s://%s:%s%s' % (URLScheme, Arguments.Host, Arguments.Port, Arguments.URLPrefix))
            serve(
                Application,
                host = Arguments.Host,
                port = Arguments.Port,
                url_scheme = URLScheme,
                threads = Arguments.Threads
            )

if __name__ == '__main__':
    Main()
