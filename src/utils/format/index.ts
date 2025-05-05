interface User {
  displayName: string;
  about: string;
}
interface FormattedList {
  [key: string]: User[];
}

export const formatUserList = (users: User[]): FormattedList => {
  const formattedList: FormattedList = {};

  (users || []).forEach((user: User) => {
    const firstLetter = user.displayName.charAt(0).toUpperCase();
    if (!formattedList[firstLetter]) {
      formattedList[firstLetter] = [];
    }
    formattedList[firstLetter].push(user);
  });

  // Sort each group alphabetically by displayName
  Object.keys(formattedList).forEach((letter) => {
    formattedList[letter].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  });

  return formattedList;
};

export const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')} `;
};

export const generateNumberFrom1to10 = () => {
  const randomNumber = Math.floor(Math.random() * 9) + 1;
  return randomNumber;
};
