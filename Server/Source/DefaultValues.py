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

import os

Prefix = 'LT_'

def GetValueStr(Name, DefaultValue) -> str:
    EnvironmentValue = os.environ.get(Name)
    return DefaultValue if EnvironmentValue is None else EnvironmentValue

def GetValueInt(Name, DefaultValue) -> int:
    try:
        return int(os.environ[Name])
    except:
        return DefaultValue

def GetValueBool(Name, DefaultValue) -> bool:
    EnvironmentValue = os.environ.get(Name)
    if EnvironmentValue in ['FALSE', 'False', 'false', '0']:
        return False
    if EnvironmentValue in ['TRUE', 'True', 'true', '1']:
        return True
    return DefaultValue

def GetValue(Name, DefaultValue, ValueType):
    EnvironmentName = Prefix + Name
    if ValueType == 'str':
        return GetValueStr(EnvironmentName, DefaultValue)
    if ValueType == 'int':
        return GetValueInt(EnvironmentName, DefaultValue)
    if ValueType == 'bool':
        return GetValueBool(EnvironmentName, DefaultValue)
    return DefaultValue

DefaultOptionsObjects = [
    {
        'Name': 'HOST',
        'DefaultValue': '0.0.0.0',
        'ValueType': 'str'
    },
    {
        'Name': 'PORT',
        'DefaultValue': 5000,
        'ValueType': 'int'
    },
    {
        'Name': 'CHARACTER_LIMIT',
        'DefaultValue': 2000,
        'ValueType': 'int'
    },
    {
        'Name': 'REQUEST_FLOOD_THRESHOLD',
        'DefaultValue': -1,
        'ValueType': 'int'
    },
    {
        'Name': 'BATCH_LIMIT',
        'DefaultValue': -1,
        'ValueType': 'int'
    },
    {
        'Name': 'DEBUG',
        'DefaultValue': False,
        'ValueType': 'bool'
    },
    {
        'Name': 'SSL',
        'DefaultValue': None,
        'ValueType': 'bool'
    },
    {
        'Name': 'FRONTEND_LANGUAGE_SOURCE',
        'DefaultValue': 'auto',
        'ValueType': 'str'
    },
    {
        'Name': 'FRONTEND_LANGUAGE_TARGET',
        'DefaultValue': 'en',
        'ValueType': 'str'
    },
    {
        'Name': 'FRONTEND_TIMEOUT',
        'DefaultValue': 1500,
        'ValueType': 'int'
    },
    {
        'Name': 'LOAD_ONLY',
        'DefaultValue': None,
        'ValueType': 'str'
    },
    {
        'Name': 'THREADS',
        'DefaultValue': 4,
        'ValueType': 'int'
    },
    {
        'Name': 'UPDATE_MODELS',
        'DefaultValue': False,
        'ValueType': 'bool'
    },    
    {
        'Name': 'URL_PREFIX',
        'DefaultValue': '/api/v1',
        'ValueType': 'str'
    }
]

DEFAULT_ARGUMENTS = {Object['Name']: GetValue(**Object) for Object in DefaultOptionsObjects}