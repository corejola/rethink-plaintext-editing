import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import css from './style.css';
import ReactHtmlParser from 'react-html-parser';

function PlaintextEditor({ file, write }) {

  const [editFileDate, seteditFileDate] = useState(moment(file.lastModified).format('MMMM Do YYYY'))
  const [value, setValue] = useState('')
  const [newValue, setNewValue] = useState(value)


  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [value, newValue]);

  const handleChange = (event) => {
    // set state of value based on changes from event
    let data = event.target.value
    setNewValue(data)
    console.log(data)
  }

  const onSave = () => {
    seteditFileDate(moment().format('MMMM Do YYYY'))
    // use the write function...
    const updatedFile = new File(
      [newValue],
      file.name,
      {
        type: 'text/markdown',
        lastModified: new Date(editFileDate)
      }
    )
    // pass updated file to write function in parent
    if (newValue !== value) {
      // pass updated file to write function in parent
      write(updatedFile)
    }      // do nothing


  }
  return (
    <div className={css.editor}>
      <h3 className={css.title}>{file.name}</h3>
      <i>text/plain</i>
      <p>Last Modified {editFileDate}</p>

      <textarea className={css.textArea} value={ReactHtmlParser(!newValue ? value : newValue)} onChange={e => handleChange(e)}></textarea>

      <button onClick={onSave}>Save Plain Text</button>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
