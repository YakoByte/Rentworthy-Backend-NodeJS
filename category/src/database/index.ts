
export = {
    databaseConnection: require('./connection').default,
    CategoryRepository: require('./repository/category').default,
    SubCategoryRepository: require('./repository/subcategory').default,
};

