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

import React from 'react';
import ISO6391 from 'iso-639-1';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const LanguageSelection = ({ Label, Getter, Setter, Items, Default = undefined }) => (
    <FormControl size='small'>
        <InputLabel>{Label}</InputLabel>
        <Select
            value={Getter}
            label={Label}
            onChange={(Event) => Setter(Event.target.value)}
        >
            {(Default) && 
                (<MenuItem value={Default.Value}>{Default.Content}</MenuItem>)}
            {(Items.map((Code, Index) => (
                <MenuItem
                    key={Index}
                    value={Code}
                >{ISO6391.getName(Code)}</MenuItem>
            )))}
        </Select>
    </FormControl>
);

export default LanguageSelection;