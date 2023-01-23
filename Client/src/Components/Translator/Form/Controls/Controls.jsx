/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * The OpenDeyim Source Code
 * A free, modern, self-hosted and open source translation service that instantly 
 * translates phrases, words and web pages into more than 30 languages. Use our 
 * API or bindings and experiment with OpenDeyim.
 * 
 * For more information, please read the documentation inside 
 * the <README.md> file which is located at the root of this directory or source code.
 * 
 * (www.github.com/codewithrodi/OpenDeyim/)
 * 
 * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
 * Full Stack Software Developer.
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

import React, { useContext } from 'react';
import ISO6391 from 'iso-639-1';
import { CopyToClipboard } from '../../../../Utilities/Runtime';
import { Tooltip, IconButton } from '@mui/material';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { AiOutlineAudioMuted, AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { IoImagesOutline, IoCopyOutline } from 'react-icons/io5';
import { TranslatorContext } from '../../../../Services/Translator/Context';
import { useAlert } from 'react-alert';
import './Controls.css';

const Controls = ({ For = '', Getter, Setter = () => {}, Language = '', Disabled }) => {
    const Alert = useAlert();
    const { GetTranslatorSettings, GetTranslationHistory } = useContext(TranslatorContext);
    const { speak, speaking, cancel } = useSpeechSynthesis();
    const { listen, listening, stop } = useSpeechRecognition({ onResult: Setter });
    const ControlList = [
        {
            Icon: { Flag: speaking, Values: [<HiOutlineSpeakerWave />, <HiOutlineSpeakerXMark />] },
            Title: ['Listen', 'The listening function is disabled, please translate something to enable the controls'],
            OnClick: () => ((speaking) ? (cancel()) : (speak({ text: Getter, voice: window.speechSynthesis.getVoices().filter((Option) => Option.lang.split('-')[0] === Language)[0] })))
        },
        {
            Icon: { Flag: listening, Values: [<MdOutlineKeyboardVoice />, <AiOutlineAudioMuted />] },
            Title: 'Translate by voice',
            OnClick: () => ((listening) ? (stop) : (() => listen({ lang: ISO6391.getName((Language === 'auto') ? ('en') : (Language)) })))(),
            Box: 'Source'
        },
        {
            Icon: <IoCopyOutline />,
            Title: ['Copy to clipboard', 'The copy function is disabled, please translate something to enable the controls'],
            OnClick: () => {
                CopyToClipboard(Getter); 
                Alert.success();
            }
        },
        {
            Icon: <AiOutlineSearch />,
            Title: ['Search related websites in CodexDrake', 'The search related websites function is disabled, please translate something to enable the controls'],
            OnClick: () => RedirectToCodexDrakeSearch(Getter)
        },
        {
            Icon: <IoImagesOutline />,
            Title: ['Search related images in CodexDrake', 'The search related images function is disabled, please translate something to enable the controls'],
            OnClick: () => RedirectToCodexDrakeSearch(Getter, 'Images')
        }
    ];

    const RedirectToCodexDrakeSearch = (Query, Type = 'All') =>
        window.open(`https://codexdrake.codewithrodi.com/search?Query=${Query}&Type=${Type}`, '_blank');

    return (
        <div className='Translation-Controls'>
            {(For === 'Source') ? (
                <p>{(Getter.length) ? (`${Getter.length} characters of ${GetTranslatorSettings.CharacterLimit}, ${Getter.split(' ').length} words.`) : (new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))}</p>
            ) : (
                <p>
                    {(Getter.length >= 1) ? (
                        <Tooltip title='Metrics regarding your translation'>
                            <span>{`${Getter.length} characters, ${Getter.split(' ').length} words.`}</span>
                        </Tooltip>
                    ) : (
                        <Tooltip title='All the translations that you have done successfully in OpenDeyim are stored locally so that you can analyze them whenever and as many times as you want'>
                            <span>{`${GetTranslationHistory.length} saved translations.`}</span>
                        </Tooltip>
                    )}
                </p>
            )}

            <div>
                {(ControlList.map(({ Icon, Title, OnClick, Box }, Index) => (
                    ( (!Box) || (Box && (For === Box)) ) && (
                        <Tooltip 
                            enterTouchDelay={0} 
                            key={Index} 
                            title={(!Array.isArray(Title)) ? (Title) : (Title[Disabled | 0])}>
                            <span>
                                <IconButton
                                    disabled={(!Array.isArray(Title)) ? (false) : (Disabled)}
                                    size='small'
                                    onClick={OnClick}>{(Icon?.Values) ? (Icon.Values[Icon.Flag | 0]) : (Icon)}</IconButton>
                            </span>
                        </Tooltip>
                    )
                )))}
            </div>
        </div>

    );
}

export default Controls;