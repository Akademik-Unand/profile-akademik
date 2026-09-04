'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      Post.belongsTo(models.PostCategory, { foreignKey: 'categoryId', as: 'category' });
      Post.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      Post.belongsTo(models.Media, { foreignKey: 'coverMediaId', as: 'cover' });
    }
  }

  Post.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      categoryId: { type: DataTypes.INTEGER, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      excerpt: { type: DataTypes.TEXT, allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
      coverMediaId: { type: DataTypes.INTEGER, allowNull: true },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      createdBy: { type: DataTypes.INTEGER, allowNull: true },
      publishedAt: { type: DataTypes.DATE, allowNull: true },
      metaTitle: { type: DataTypes.STRING, allowNull: true },
      metaDescription: { type: DataTypes.TEXT, allowNull: true },
      metaKeywords: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts',
      underscored: true,
    },
  );

  return Post;
};
