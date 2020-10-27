import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import css from './style.css';


// import the prop of the md file into the source of the ReactMarkdown
function AddFile(write) {

    const [dateCreated, setDateCreated] = useState(moment().format('dddd, MMMM DD YYYY'))
    const [value, setValue] = useState('')
    const [newValue, setNewValue] = useState('')
    const [file, setFile] = useState('')


    // useEffect(() => {
    //     (async () => {
    //         setValue(await file.text());
    //     })();
    // }, [value, newValue]);

    // create file name based off of the file name input & the selected file type


    // <option value="text/plain" selected>.txt</option>
    // <option value="text/markdown">.md</option>
    // <option value="text/javascript">.js</option>
    // <option value="application/json" >.json</option>

    const handleChange = (event) => {
        // set state of value based on changes from event
        setNewValue(event.target.value)
        // handle event and pass through new file
        // 
        new File(
            [],
            'filename',
            {
                type: 'text/plain',
                lastModified: new Date(dateCreated)
            })

    }



    const onSave = () => {
        let today = moment().format('dddd, MMMM DD YYYY')
        seteditFileDate(today)
        console.log(today)
        // use the write function...
        const updatedFile = new File(
            [value],
            file.name,
            {
                type: 'text/markdown',
                lastModified: dateCreated
            }
        )

        if (newValue !== value) {
            // pass updated file to write function in parent
            write(updatedFile)
        } // else do nothing..
    }


    return (
        <div className={css.editor}>
            <h3 className={css.title}>Create New File</h3>
            <p>Date: {dateCreated}</p>

            <label>
                File Name:
                <input type="text" name="fileName" onChange={e => handleFileName(e)} />
            </label>
            <label for="fileType">File Type</label>
            <select id="fileType" onChange>
                <option value="text/plain" selected>.txt</option>
                <option value="text/markdown">.md</option>
                <option value="text/javascript">.js</option>
                <option value="application/json" >.json</option>
            </select>

            <textarea className={css.textArea} value={!newValue ? value : newValue} onChange={e => handleChange(e)}></textarea>

            <button onClick={onSave}>Save File</button>

        </div>
    );
}

// checking/validating prop types
AddFile.propTypes = {
    file: PropTypes.object,
    write: PropTypes.func
};

export default AddFile;
