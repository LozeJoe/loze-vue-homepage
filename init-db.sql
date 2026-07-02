-- ============================================
-- Loze Blog 完整建表脚本
-- 数据库: loze_blog
-- 选题: 题目二 个人博客前后台管理系统
-- 学号: 2400130326 | 姓名: 刘哲凯
-- ============================================

CREATE DATABASE IF NOT EXISTS loze_blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loze_blog;

-- 用户表
DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    name VARCHAR(50) COMMENT '昵称',
    phone VARCHAR(20) COMMENT '手机号',
    address VARCHAR(200) COMMENT '地址',
    role VARCHAR(20) DEFAULT 'admin' COMMENT '角色',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0 COMMENT '逻辑删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 文章表
DROP TABLE IF EXISTS t_post;
CREATE TABLE t_post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE COMMENT 'URL标识',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content LONGTEXT COMMENT '内容',
    tags VARCHAR(500) COMMENT '标签(逗号分隔)',
    category VARCHAR(100) COMMENT '分类',
    description VARCHAR(500) COMMENT '摘要',
    draft INT DEFAULT 0 COMMENT '0=已发布 1=草稿/下架',
    cover_image VARCHAR(500) COMMENT '封面图',
    date DATETIME COMMENT '发布日期',
    author_id BIGINT COMMENT '作者ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_draft (draft)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 分类表
DROP TABLE IF EXISTS blog_category;
CREATE TABLE blog_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    slug VARCHAR(50) COMMENT 'URL标识',
    description VARCHAR(200) COMMENT '分类描述',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0 COMMENT '逻辑删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='博客分类表';

-- 标签表
DROP TABLE IF EXISTS blog_tag;
CREATE TABLE blog_tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    slug VARCHAR(50) COMMENT 'URL标识',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0 COMMENT '逻辑删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='博客标签表';

-- 文章-标签关联表
DROP TABLE IF EXISTS blog_article_tag;
CREATE TABLE blog_article_tag (
    article_id BIGINT NOT NULL COMMENT '文章ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    PRIMARY KEY (article_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关联表';

-- 评论表
DROP TABLE IF EXISTS t_comment;
CREATE TABLE t_comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT COMMENT '文章ID',
    content TEXT NOT NULL COMMENT '评论内容',
    author VARCHAR(100) COMMENT '评论者',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 初始数据
INSERT INTO t_user (username, password, name, role) VALUES 
('admin', 'admin123', 'Loze', 'admin');

INSERT INTO blog_category (name, slug, sort_order) VALUES 
('技术', 'tech', 1),
('生活', 'life', 2),
('随笔', 'essay', 3);

INSERT INTO blog_tag (name, slug) VALUES 
('Vue.js', 'vuejs'),
('Spring Boot', 'springboot'),
('前端', 'frontend'),
('后端', 'backend');
