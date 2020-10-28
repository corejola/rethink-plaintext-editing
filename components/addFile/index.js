import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import css from './style.css';

const fileExt = ['.txt', '.md', '.js', '.json']
const fileTypes = ["text/plain", "text/markdown", "text/javascript", "application/json"]

// import the prop of the md file into the source of the ReactMarkdown
function AddFile({ write }) {

    const [dateCreated, setDateCreated] = useState(moment().format('dddd, MMMM DD YYYY'))
    const [value, setValue] = useState('')
    const [name, setName] = useState('')
    const [fileName, setFileName] = useState('')
    const [type, setType] = useState('')

    // create file name based off of the file name input & the selected file type
    const handleFileName = (event) => {
        let name = event.target.value
        setName(name)
    }


    const handleFileType = (event) => {
        let fileType = event.target.value
        setType(fileType)

        // only works whens fileExt & fileTypes are paired in order...
        for (let i = 0; i < fileTypes.length; i++) {
            if (fileType === fileTypes[i]) {
                console.log(`/${name}${fileExt[i]}`)
                setFileName(`/${name}${fileExt[i]}`)
            }
        }
    }

    const handleContent = (event) => {
        // set state of value based on changes from event
        // useEffect before passing through write
        setValue(event.target.value)

    }

    const onSave = () => {
        let today = moment()

        const newFile = new File(
            [value],
            fileName,
            {
                type: type,
                lastModified: setDateCreated(today)
            }
        )

        console.log(newFile)

        if (value) {
            // pass updated file to write function in parent
            // useEffect before passing through write!!!!!
            write(newFile)
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
            {/* <label for="fileType">File Type</label> */}
            <select id="fileType" onChange={e => handleFileType(e)}>
                <option value="text/plain" selected>Select File Type</option>
                <option value="text/plain" >.txt</option>
                <option value="text/markdown">.md</option>
                <option value="text/javascript">.js</option>
                <option value="application/json" >.json</option>
            </select>

            <textarea className={css.textArea} value={value} onChange={e => handleContent(e)}></textarea>

            <button onClick={onSave} >Save File</button>

        </div>
    );
}

// checking/validating prop types
AddFile.propTypes = {
    file: PropTypes.object,
    write: PropTypes.func
};

export default AddFile;
