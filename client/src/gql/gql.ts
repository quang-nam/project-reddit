/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment fieldError on FieldError {\n  field\n  message\n}": types.FieldErrorFragmentDoc,
    "fragment postWithUserInfo on Post {\n  id\n  title\n  text\n  createdAt\n  updatedAt\n  textSnippet\n  userId\n  points\n  user {\n    id\n    username\n  }\n}": types.PostWithUserInfoFragmentDoc,
    "fragment userInfo on User {\n  id\n  username\n  email\n}": types.UserInfoFragmentDoc,
    "fragment userMutationResponse on UserMutationResponse {\n  code\n  success\n  message\n  user {\n    ...userInfo\n  }\n  error {\n    field\n    message\n  }\n}": types.UserMutationResponseFragmentDoc,
    "mutation ChangePassword($userId: String!, $token: String!, $changePasswordInput: ChangePasswordInput!) {\n  changePassword(\n    userId: $userId\n    token: $token\n    changePasswordInput: $changePasswordInput\n  ) {\n    code\n    success\n    message\n    user {\n      username\n    }\n    error {\n      field\n      message\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation CreatePost($createPostInput: createPostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    code\n    success\n    message\n    post {\n      id\n      text\n      title\n      createdAt\n      updatedAt\n    }\n    error {\n      field\n      message\n    }\n  }\n}": types.CreatePostDocument,
    "mutation DeletePost($id: ID!) {\n  deletePost(id: $id) {\n    code\n    success\n    message\n  }\n}": types.DeletePostDocument,
    "mutation forgotPassword($forgotPasswordInput: ForgotPasswordInput!) {\n  forgotPassword(forgotPasswordInput: $forgotPasswordInput)\n}": types.ForgotPasswordDocument,
    "mutation login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n    }\n    error {\n      field\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n    }\n    error {\n      field\n      message\n    }\n  }\n}": types.RegisterDocument,
    "mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    code\n    success\n    message\n    post {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      textSnippet\n    }\n    error {\n      field\n      message\n    }\n  }\n}": types.UpdatePostDocument,
    "mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {\n  vote(inputVoteValue: $inputVoteValue, postId: $postId) {\n    code\n    success\n    message\n    post {\n      id\n      text\n      title\n      createdAt\n      updatedAt\n      points\n    }\n    error {\n      field\n      message\n    }\n  }\n}": types.VoteDocument,
    "query Me {\n  me {\n    ...userInfo\n  }\n}": types.MeDocument,
    "query Post($id: ID!) {\n  post(id: $id) {\n    title\n    text\n    createdAt\n    id\n    userId\n    points\n  }\n}": types.PostDocument,
    "query PostIds($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    paginatedPosts {\n      id\n    }\n  }\n}": types.PostIdsDocument,
    "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      id\n      title\n      createdAt\n      updatedAt\n      points\n      textSnippet\n      user {\n        id\n        username\n      }\n    }\n  }\n}": types.PostsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment fieldError on FieldError {\n  field\n  message\n}"): (typeof documents)["fragment fieldError on FieldError {\n  field\n  message\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment postWithUserInfo on Post {\n  id\n  title\n  text\n  createdAt\n  updatedAt\n  textSnippet\n  userId\n  points\n  user {\n    id\n    username\n  }\n}"): (typeof documents)["fragment postWithUserInfo on Post {\n  id\n  title\n  text\n  createdAt\n  updatedAt\n  textSnippet\n  userId\n  points\n  user {\n    id\n    username\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userInfo on User {\n  id\n  username\n  email\n}"): (typeof documents)["fragment userInfo on User {\n  id\n  username\n  email\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userMutationResponse on UserMutationResponse {\n  code\n  success\n  message\n  user {\n    ...userInfo\n  }\n  error {\n    field\n    message\n  }\n}"): (typeof documents)["fragment userMutationResponse on UserMutationResponse {\n  code\n  success\n  message\n  user {\n    ...userInfo\n  }\n  error {\n    field\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($userId: String!, $token: String!, $changePasswordInput: ChangePasswordInput!) {\n  changePassword(\n    userId: $userId\n    token: $token\n    changePasswordInput: $changePasswordInput\n  ) {\n    code\n    success\n    message\n    user {\n      username\n    }\n    error {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation ChangePassword($userId: String!, $token: String!, $changePasswordInput: ChangePasswordInput!) {\n  changePassword(\n    userId: $userId\n    token: $token\n    changePasswordInput: $changePasswordInput\n  ) {\n    code\n    success\n    message\n    user {\n      username\n    }\n    error {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($createPostInput: createPostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    code\n    success\n    message\n    post {\n      id\n      text\n      title\n      createdAt\n      updatedAt\n    }\n    error {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation CreatePost($createPostInput: createPostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    code\n    success\n    message\n    post {\n      id\n      text\n      title\n      createdAt\n      updatedAt\n    }\n    error {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeletePost($id: ID!) {\n  deletePost(id: $id) {\n    code\n    success\n    message\n  }\n}"): (typeof documents)["mutation DeletePost($id: ID!) {\n  deletePost(id: $id) {\n    code\n    success\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation forgotPassword($forgotPasswordInput: ForgotPasswordInput!) {\n  forgotPassword(forgotPasswordInput: $forgotPasswordInput)\n}"): (typeof documents)["mutation forgotPassword($forgotPasswordInput: ForgotPasswordInput!) {\n  forgotPassword(forgotPasswordInput: $forgotPasswordInput)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n    }\n    error {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n    }\n    error {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n    }\n    error {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n    }\n    error {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    code\n    success\n    message\n    post {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      textSnippet\n    }\n    error {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    code\n    success\n    message\n    post {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      textSnippet\n    }\n    error {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {\n  vote(inputVoteValue: $inputVoteValue, postId: $postId) {\n    code\n    success\n    message\n    post {\n      id\n      text\n      title\n      createdAt\n      updatedAt\n      points\n    }\n    error {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation Vote($inputVoteValue: VoteType!, $postId: Int!) {\n  vote(inputVoteValue: $inputVoteValue, postId: $postId) {\n    code\n    success\n    message\n    post {\n      id\n      text\n      title\n      createdAt\n      updatedAt\n      points\n    }\n    error {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...userInfo\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...userInfo\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($id: ID!) {\n  post(id: $id) {\n    title\n    text\n    createdAt\n    id\n    userId\n    points\n  }\n}"): (typeof documents)["query Post($id: ID!) {\n  post(id: $id) {\n    title\n    text\n    createdAt\n    id\n    userId\n    points\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PostIds($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    paginatedPosts {\n      id\n    }\n  }\n}"): (typeof documents)["query PostIds($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    paginatedPosts {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      id\n      title\n      createdAt\n      updatedAt\n      points\n      textSnippet\n      user {\n        id\n        username\n      }\n    }\n  }\n}"): (typeof documents)["query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      id\n      title\n      createdAt\n      updatedAt\n      points\n      textSnippet\n      user {\n        id\n        username\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;