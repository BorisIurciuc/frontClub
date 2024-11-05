export interface ILink {
  pathname: string;
  title: string;
}

export const links = (isAuthenticated: boolean, isAdmin: boolean = false, username?: string): ILink[] => {
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
        pathname: '/news',
        title: 'News',
      },
      {
        pathname: '/dashboard',
        title: username ? `${username}` : 'Dashboard',
      },
      {
        pathname: '/review',
        title: 'Review',
      }
    );
  }

  // Links for administrator
  if (isAdmin) {
    baseLinks.push({
      pathname: '/admin',
      title: 'Admin Panel',
    });
  }

  return baseLinks;
};
