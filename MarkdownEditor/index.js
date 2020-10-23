import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown'

import css from './style.css';

// extractValue from markdown file
function MDvalue(file) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return value;
}

// import the prop of the md file into the source of the ReactMarkdown
function MarkdownEditor({ file, write }) {

  const markDownSource = MDvalue(file)
  // console.log(file, write);
  return (
    <div className={css.editor}>
      <h3>TODO</h3>
      <i>text/markdown Previewer</i>
      {/* pass file into ReactMarkdown */}
      <ReactMarkdown source={markDownSource} />
    </div>
  );
}

// checking/validating prop types
MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
