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
# * (www.github.com/codewithrodi/OpenDeyim/)
# * 
# * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
# * Full Stack Software Developer.
# *
# * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

import json, sys, requests
from typing import Any, Dict
from urllib import request, parse

class OpenDeyimAPI:
    DEFAULT_URL = 'https://deyimapi.codewithrodi.com/api/v1'

    def __init__(self, URL: str = None) -> None:
        self.URL = OpenDeyimAPI.DEFAULT_URL if URL is None else URL
        if self.URL[-1] != '/':
            self.URL += '/'

    def Translate(self, Query: str, Source: str = 'auto', Target: str = 'en', Format: str = 'text') -> Any:
        URL = self.URL + '/translate'
        Response = requests.post(URL, json = {
            'Query': Query,
            'Source': Source,
            'Target': Target,
            'Format': Format })
        return json.loads(Response.text)['Data']['TranslatedText']

    def Detect(self, Query: str) -> Any:
        URL = self.URL + '/detect'
        Response = requests.post(URL, json = { 'Query': Query })
        return json.loads(Response.text)['Data']

    def Languages(self) -> Any:
        URL = self.URL + '/languages'
        return json.loads(requests.get(URL).text)['Data']