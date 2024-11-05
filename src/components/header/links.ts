export interface ILink {
  pathname: string;
  title: string;
}

export const links = (isAuthenticated: boolean, username?: string): ILink[] => {
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
    baseLinks.push(
        {
      pathname: '/school',
      title: 'School',
        },
        {
          pathname: '/review',
          title: 'Review',
        },
        {
          pathname: '/dashboard',
          title: username ? `${username}` : 'Dashboard',
        },
        
    );
  }

  return baseLinks;
};
