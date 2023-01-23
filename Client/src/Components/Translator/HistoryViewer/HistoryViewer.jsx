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
import Fade from '../../../Components/General/Fade';
import TranslationHistoryConcept from '../../../Assets/Images/Home/Translation-History-Concept.jpg';
import { TranslatorContext } from '../../../Services/Translator/Context';
import { SlTrash } from 'react-icons/sl';
import { IconButton } from '@mui/material';
import './HistoryViewer.css';

const HistoryViewer = () => {
    const { GetTranslationHistory, HandleStoredTranslationDelete } = useContext(TranslatorContext);

    return (
        <section id='Translation-History-Box'>
            <article>
                <Fade left>
                    <img 
                        className='Cursor-Hover-Effect'
                        src={TranslationHistoryConcept} 
                        alt='Illustration of translation history' />
                </Fade>
            </article>

            <article id='Translation-History-Content'>
                <Fade right>
                    <div>
                        <h3 className='Cursor-Hover-Effect'>Registration of requested translations</h3>
                        <p>Consider that absolutely no type of information is shared with third parties, we use your local storage to store this and other types of information with the sole purpose of improving your experience within the platform.</p>
                    </div>

                    {(GetTranslationHistory.length >= 1) ? (
                        <div id='Translation-History'>
                            {GetTranslationHistory.map((Data, Index) => (
                                <div key={Index} className='Record-Box'>
                                    <div>
                                        <div className='Record-Heading'>
                                            <p>{(Data.Source === 'auto') ? (`Auto Detected, ${ISO6391.getName(Data.DetectedLanguage.Language)} with precision of ${Data.DetectedLanguage.Confidence}%`) : (ISO6391.getName(Data.Source))} → {ISO6391.getName(Data.Target)}</p>
                                            <p>{new Date(Data.At).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <IconButton size='small' onClick={() => HandleStoredTranslationDelete(Data)}>
                                            <SlTrash />
                                        </IconButton>
                                    </div>
                                    <div>
                                        <p>{Data.Query}</p>
                                        <p>→ {Data.TranslatedText}</p>
                                    </div>
                                </div>
                            ))}

                            <div id='Translation-History-Stats-Box'>
                                <p>There are {GetTranslationHistory.length} translations stored</p>
                            </div>
                        </div>
                    ) : (
                        <div id='Translation-History-NExists'>
                            <p className='Cursor-Hover-Effect'>You haven't done any translation yet, start by requesting one and unlock this functionality.</p>
                        </div>
                    )}
                </Fade>
            </article>
        </section>
    );
};

export default HistoryViewer;