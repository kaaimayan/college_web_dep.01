import React, { createContext, useContext, useState, useCallback } from 'react';

const LibraryContext = createContext(null);

/**
 * LibraryProvider wraps the entire app and exposes a shared `refreshKey`.
 * Any page/component that issues, returns, or fulfills a book reservation
 * should call `triggerRefresh()` so that Dashboard and TopStudentCard will
 * automatically re-fetch the latest data from the backend.
 */
export const LibraryProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <LibraryContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used inside a LibraryProvider');
  }
  return context;
};
