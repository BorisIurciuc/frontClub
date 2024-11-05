export interface ILink {
  pathname: string;
  title: string;
}

export const links = (isAuthenticated: boolean, isAdmin: boolean , username?: string): ILink[] => {
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

  
  if (isAuthenticated && isAdmin) {
    baseLinks.push({
      pathname: '/admin',
      title: 'Admin Panel',
    });
  }

  return baseLinks;
};
