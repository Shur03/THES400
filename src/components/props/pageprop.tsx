type PageProps<T = {}> = {
  params: T;
  searchParams?: Record<string, string | string[] | undefined>;
};
export default PageProps;
