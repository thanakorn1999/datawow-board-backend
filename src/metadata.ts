/* eslint-disable */
export default async () => {
  const t = {
    ['./users/entities/user.entity']: await import(
      './users/entities/user.entity'
    ),
    ['./blogs/entities/blog.entity']: await import(
      './blogs/entities/blog.entity'
    ),
    ['./comments/entities/comment.entity']: await import(
      './comments/entities/comment.entity'
    ),
    ['./communities/entities/community.entity']: await import(
      './communities/entities/community.entity'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./shared/base.entity'),
          {
            BaseEntity: {
              id: { required: true, type: () => Number },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
              deletedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./users/entities/user.entity'),
          { User: { username: { required: true, type: () => String } } },
        ],
        [
          import('./auth/dto/sign-in.dto'),
          {
            SignInDto: {
              username: { required: true, type: () => String, maxLength: 255 },
            },
          },
        ],
        [
          import('./blogs/entities/blog.entity'),
          {
            Blog: {
              title: { required: true, type: () => String },
              text: { required: true, type: () => String },
              communityId: { required: true, type: () => Number },
              userId: { required: true, type: () => Number },
            },
          },
        ],
        [
          import('./blogs/dto/post-blog.dto'),
          {
            PostBlogDto: {
              title: { required: true, type: () => String, maxLength: 255 },
              text: { required: true, type: () => String, maxLength: 1000 },
              communityId: { required: true, type: () => Number },
            },
          },
        ],
        [
          import('./comments/entities/comment.entity'),
          {
            Comment: {
              text: { required: true, type: () => String },
              blogId: { required: true, type: () => Number },
              userId: { required: true, type: () => Number },
            },
          },
        ],
        [
          import('./communities/entities/community.entity'),
          { Community: { text: { required: true, type: () => Number } } },
        ],
      ],
      controllers: [
        [
          import('./app.controller'),
          { AppController: { getHello: { type: String } } },
        ],
        [
          import('./auth/auth.controller'),
          { AuthController: { signIn: {}, signOut: {} } },
        ],
        [
          import('./users/users.controller'),
          {
            UsersController: {
              getMe: { type: t['./users/entities/user.entity'].User },
            },
          },
        ],
        [
          import('./blogs/blogs.controller'),
          {
            BlogsController: {
              list: { type: t['./blogs/entities/blog.entity'].Blog },
              listMe: { type: t['./blogs/entities/blog.entity'].Blog },
              details: { type: t['./blogs/entities/blog.entity'].Blog },
              create: {},
            },
          },
        ],
        [
          import('./comments/comments.controller'),
          {
            CommentsController: {
              getMe: { type: t['./comments/entities/comment.entity'].Comment },
            },
          },
        ],
        [
          import('./communities/communities.controller'),
          {
            CommunitysController: {
              getMe: {
                type: t['./communities/entities/community.entity'].Community,
              },
            },
          },
        ],
      ],
    },
  };
};
