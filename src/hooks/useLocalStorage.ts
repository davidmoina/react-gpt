export const useLocalStorage = () => {
  const getThreadId = () => {
    const threadId = localStorage.getItem('threadId');
    console.log(threadId);

    return threadId;
  };

  const storeThreadId = (value: string) => {
    localStorage.setItem('threadId', value);
  };

  return { getThreadId, storeThreadId };
};
