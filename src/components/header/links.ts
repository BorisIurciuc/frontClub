export interface ILink {
  pathname: string;
  title: string;
}

export const links = (isAuthenticated: boolean): ILink[] => {
  const baseLinks: ILink[] = [
    {
      pathname: '/',
      title: 'Home',
    },
    {
      pathname: '/activityList',
      title: 'Courses',
    },
  ];

  if (isAuthenticated) {
    baseLinks.push({
      pathname: '/school',
      title: 'School',
    });
  }

  return baseLinks;
};
