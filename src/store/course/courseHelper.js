export const addNewNotes = (notes = [], noteToAdd) => {
  const existingNote = notes.find(
    (note) =>
      note.resumePoint === noteToAdd.resumePoint &&
      note.sectionId === noteToAdd.sectionId &&
      note.lessonId === noteToAdd.lessonId
  );

  if (existingNote) {
    return notes.map((note) =>
      note.resumePoint === noteToAdd.resumePoint &&
      note.sectionId === noteToAdd.sectionId &&
      note.lessonId === noteToAdd.lessonId
        ? {
            ...note,
            lessonId: noteToAdd.lessonId,
            sectionId: noteToAdd.sectionId,
            created_at: noteToAdd.created_at,
            description: noteToAdd.description,
          }
        : note
    );
  }
  return [noteToAdd, ...notes];
};

export const updateLessonDto = (lessonDtos = [], updatedLessonId) => {
  const updatedLesson = lessonDtos.find(
    (lessonDto) => lessonDto.id === updatedLessonId
  );

  if (updatedLesson) {
    return lessonDtos.map((lessonDto) =>
      lessonDto.id === updatedLessonId
        ? {
            ...lessonDto,
            completed: true,
          }
        : lessonDto
    );
  }
  return lessonDtos;
};

export const deleteNotes = (notes = [], noteId) => {
  return notes.filter((note) => note.id !== noteId);
};
