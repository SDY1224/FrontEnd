import React from 'react';
import './index.scss';
import classNames from 'classnames';
import { chapterToPreviewHTML } from 'screens/MediaSettings/controllers/epub/chapter.html-converter';

export function MarkdownPreviewer({ value, className }) {
  const { previewHTML } = chapterToPreviewHTML(value);

  const style = classNames('ee-md-pview', className);

  return (
    <div className={style}>
      <div className="ee-md-pview-html" dangerouslySetInnerHTML={{ __html: previewHTML }} />
    </div>
  );
}
