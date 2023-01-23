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

import pycld2 as cld2

class UnknownLanguage(Exception):
    pass

class Language(object):
    def __init__(self, Choice):
        Name, Code, Confidence, ByteSize = Choice
        self.Code = Code
        self.Name = Name
        self.Confidence = float(Confidence)
        self.ReadBytes = int(ByteSize)

    def __str__(self) -> str:
        return ('name: {:<12}code: {:<9}confidence: {:>5.1f} '
                "read bytes: {:>6}",format(self.Name, self.Code, self.Confidence, self.ReadBytes))
    
    @staticmethod
    def FromCode(Code):
        return Language(("", Code, 100, 0))
    
class Detector(object):
    def __init__(self, Text, Quiet = False):
        self.Text = Text
        self.Reliable = True
        self.Quiet = Quiet
        self.Detect(Text)

    @staticmethod
    def SupportedLanguages() -> tuple:
        return [Name.capitalize() for Name, Code in cld.LANGUAGES if not Name.startswith('X_')]
    
    def Detect(self, Text) -> str:
        Reliable, Index, Top3Choices = cld2.detect(Text, bestEffort = False)
        if not Reliable:
            self.Reliable = False
            Reliable, Index, Top3Choices = cld2.detect(Text, bestEffort = True)
            if not self.Quiet:
                if not Reliable:
                    raise UnknownLanguage('Try passing a longer snippet of text')
        self.Languages = [Language(X) for X in Top3Choices]
        self.Language = self.Languages[0]
        return self.Language

    def __str__(self) -> str:
        Text = 'Prediction is reliable: {}\n'.format(self.Reliable)
        Text += u"\n".join(['Language {}: {}'.format(Iterator + 1, str(Lang))
            for Iterator, Lang in enumerate(self.Languages)])
        return Text