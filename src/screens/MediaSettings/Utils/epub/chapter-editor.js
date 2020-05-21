import _ from 'lodash';
import { prompt } from 'utils';
import { epubState } from './epub-state';
import {
  EPUB_STEP_SPLIT,
  EPUB_STEP_DOWNLOAD,
  EDITOR_TYPE_SPLITTER,
  EDITOR_MARKDOWN,
} from './constants';

import { buildChapter, buildSubChapter } from './util';

export function backToStep1() {
  epubState.setStep(EPUB_STEP_SPLIT);

  prompt.addOne(
    {
      text: 'Splitting chapters might lost the changes you made.',
      position: 'left bottom',
      timeout: 4000,
    },
    true,
  );
}

export function proceedToStep3() {
  epubState.setStep(EPUB_STEP_DOWNLOAD);

  prompt.addOne(
    {
      text: 'Finish step! Download your ePub file.',
      status: 'success',
      position: 'left bottom',
      timeout: 4000,
    },
    true,
  );
}

// //////////////////////////////////////////////////////////////////
// Helpers
// //////////////////////////////////////////////////////////////////
function saveChapterAttr(chapterId, attr, value) {
  const chapters = epubState.chapters;
  const chapterIndex = _.findIndex(chapters, { id: chapterId });
  if (chapterIndex < 0) return;

  chapters[chapterIndex][attr] = value;
  chapters[chapterIndex] = buildChapter(chapters[chapterIndex], false);
  epubState.updateEpubChapters(chapters, chapters[chapterIndex]);
}

function saveSubChapterAttr(subChapterIndex, attr, value) {
  const chapters = epubState.chapters;
  const chapterId = epubState.currChapter.id;
  const chapterIndex = _.findIndex(chapters, { id: chapterId });
  if (chapterIndex < 0) return;

  const subChapters = chapters[chapterIndex].subChapters;

  subChapters[subChapterIndex][attr] = value;
  subChapters[subChapterIndex] = buildSubChapter(subChapters[subChapterIndex], false);
  chapters[chapterIndex] = buildChapter(chapters[chapterIndex], false);
  epubState.updateEpubChapters(chapters, chapters[chapterIndex]);
}

// //////////////////////////////////////////////////////////////////
// Title
// //////////////////////////////////////////////////////////////////

export function saveChapterTitle(chapterId, title) {
  saveChapterAttr(chapterId, 'title', title);
}

export function saveSubChapterTitle(subChapterIndex, title) {
  saveSubChapterAttr(subChapterIndex, 'title', title);
}

// //////////////////////////////////////////////////////////////////
// Image
// //////////////////////////////////////////////////////////////////

export function saveChapterImage(chapterId, image) {
  saveChapterAttr(chapterId, 'image', image);
}

export function removeChapterImage(chapterId) {
  saveChapterImage(chapterId, undefined);
}

export function saveSubChapterImage(subChapterIndex, image) {
  saveSubChapterAttr(subChapterIndex, 'image', image);
}

export function removeSubChapterImage(subChapterIndex) {
  saveSubChapterImage(subChapterIndex, undefined);
}

// //////////////////////////////////////////////////////////////////
// Text/Content
// //////////////////////////////////////////////////////////////////

export function saveChapterText(chapterId, content) {
  saveChapterAttr(chapterId, 'content', content + EDITOR_TYPE_SPLITTER + EDITOR_MARKDOWN);
}

export function saveSubChapterText(subChapterIndex, text) {
  saveSubChapterAttr(subChapterIndex, 'text', text + EDITOR_TYPE_SPLITTER + EDITOR_MARKDOWN);
}
