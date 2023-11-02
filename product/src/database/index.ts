
export = {
    databaseConnection: require('./connection').default,
    CategoryRepository: require('./repository/category').default,
    SubCategoryRepository: require('./repository/subcategory').default,
    ProductRepository: require('./repository/product').default,
    UserRepository: require('./repository/user').default,
    HistoryRepository: require('./repository/history').default,
    // ImageRepository: require('./repository/image').default,
};

