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

from argostranslate import package, translate
import Source.Language

def Boot(LoadOnly = None, UpdateModels = False) -> None:
    try:
        CheckAndInstallModels(Force = UpdateModels, LoadOnlyLangCodes = LoadOnly)
    except Exception as Error:
        print(':-: Cannot update models (normal if you are offline): %s' % str(Error))

def CheckAndInstallModels(Force = False, LoadOnlyLangCodes = None) -> None:
    if len(package.get_installed_packages()) < 2 or Force:
        print(':-: Updating language models')
        package.update_package_index()
        AvailablePackages = package.get_available_packages()
        print(':-: Found %s models' % len(AvailablePackages))
        if LoadOnlyLangCodes is not None:
            UnavailableLangCodes = set(LoadOnlyLangCodes)
            for Pack in AvailablePackages:
                UnavailableLangCodes -= { Pack.from_code, Pack.to_code }
            if UnavailableLangCodes:
                raise ValueError(
                    'Unavailable language codes: %s.'
                    % ','.join(sorted(UnavailableLangCodes)))
            AvailablePackages = [
                Pack for Pack in AvailablePackages
                if Pack.from_code in LoadOnlyLangCodes and Pack.to_code in LoadOnlyLangCodes]
            if not AvailablePackages:
                raise ValueError('No available package')
            print(':-: Keep %s models' % len(AvailablePackages))
        
        for AvailablePackage in AvailablePackages:
            print(':-: Downloading %s (%s)...' % (AvailablePackage, AvailablePackage.package_version))
            AvailablePackage.install()
        Source.Language.Languages = translate.get_installed_languages()
        print(f':-: Loaded support for {len(translate.get_installed_languages())} ({len(AvailablePackages)} models total)!')
