import React, { useState, useEffect } from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './style.less'

const Braft = () => {

  const [editorState, setEditorState] = useState(() => {
    BraftEditor.createEditorState(null)
  })

  useEffect(() => {
    
  }, [])

  const handleChange = (editorState) => {
    setEditorState(editorState)
  }

  return (
    <div class="sage-page-wrapper">
      <div className="editor-wrapper">
        <BraftEditor value={editorState} onChange={handleChange} contentStyle={{height: 400}} />
      </div>
    </div>

  )
}

export default Braft