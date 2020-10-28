import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown'
import { listFiles } from '../files';


// Used below, these need to be registered !!!!!!!
import MarkdownEditor from '../components/MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';
import JSEditor from '../components/JsEditor';
import JsonEditor from '../components/JsonEditor';
import AddFile from '../components/AddFile'

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

// date updated when modified
function FilesTable({ activeFile, setActiveFile, allFiles }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {allFiles.map(file => (
            < tr
              key={file.name}
              className={
                classNames(
                  css.row,
                  activeFile && activeFile.name === file.name ? css.active : ''
                )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file }) {

  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file, value]);

  // Render for .md
  if (file.type == 'text/markdown') {
    return (
      <div className={css.preview}>
        <div className={css.title}>{path.basename(file.name)}</div>
        <ReactMarkdown className={css.content} source={value} />
      </div>
    )
  }
  // Render for all other file types
  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types !!!!!!!
// Handle .js & .json editors..
const REGISTERED_EDITORS = {
  "text/plain": PlaintextEditor,
  "text/markdown": MarkdownEditor,
  "text/javascript": JSEditor,
  "application/json": JsonEditor,
  "newfile": AddFile
};

function PlaintextFilesChallenge() {

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [click, setClick] = useState(false)
  const [newFile, setNewFile] = useState(false)
  const [allFiles, setAllFiles] = useState([])

  // LIMITATION: Sets Initial files array state & continually renders this, cannot add to this state, as useEffect will continue to call the listFiles function
  useEffect(() => {
    let files = listFiles()
    setFiles(files)
    setAllFiles(files)
  }, []);

  useEffect(() => {
    console.log(allFiles)
  }, [allFiles])


  const write = (file) => {
    //  check if file.name exists in files
    console.log('Writing soon... ', file.name);

    // need to check to see if this file exits in the files array
    const found = files.filter((item) => item.name == file.name)
    // if it does not exist, push new file to the files array
    if (found.length === 0) {
      console.log("create new file")
      setAllFiles(allFiles => [...allFiles, file]);

    } else {
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === file.name) {
          files.splice(i, 1, file)
          setFiles(files)
        }
      }
      setClick(false)
      console.log(`${file.name} has been updated`)
    }
    // TODO: Write the file to the `files` array!!!!!!!
    setNewFile(false)
  };

  // Toggles the editor button to change the css class in order to display the Previewer or Editor
  const toggleEditor = () => {
    if (click) {
      setClick(false);
    } else {
      setClick(true)
    }
  }

  const addNewFile = () => {
    // toggle to a blank Editor
    if (!newFile) {
      setActiveFile(null)
      setNewFile(true)
    } else {
      setNewFile(false)
    }
  }

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let's explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>
        {/* add a new file button */}
        <button className={css.addFile} onClick={addNewFile}>Add New File</button>

        <FilesTable
          allFiles={allFiles}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      {/* window showing editor/ active file, need to pass value from Previewer*/}
      <main className={css.editorWindow}>

        {/* ADD A TOGGLE BUTTON HERE TO TOGGLE BETWEEN EDITOR & PREVIEWER COMPONENTS */}

        {activeFile && (
          <>
            <button className={css.toggleEditor} onClick={toggleEditor}>Toggle Editor</button>
            <div className={click ? css.hide : css.show}>
              <Previewer file={activeFile} />
            </div>
            <div className={click ? css.show : css.hide}>
              {Editor && <Editor file={activeFile} write={write} />}
            </div>
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}

        {/* Render a blank form to create a new file */}
        {/* need cancel function */}
        {newFile && <AddFile write={write} />}

      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
