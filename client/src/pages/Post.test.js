import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Post from './Post';
import axios from '../api/axios';

jest.mock('../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    username: 'LoggedInUser',
  }),
}));

const renderPostPage = async (comments) => {
  axios.get.mockImplementation((url) => {
    if (url === '/posts/byId/42') {
      return Promise.resolve({
        data: {
          id: 42,
          title: 'Post title',
          postText: 'Post body',
          userName: 'PostAuthor',
          createdAt: '2026-03-12T18:00:00.000Z',
          likes: 0,
        },
      });
    }

    if (url === '/comments/42') {
      return Promise.resolve({ data: comments });
    }

    return Promise.reject(new Error(`Unexpected GET ${url}`));
  });

  const rendered = render(
    <MemoryRouter initialEntries={['/post/42']}>
      <Routes>
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/comments/42'));

  return rendered;
};

describe('Post comment authors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the saved comment author name', async () => {
    const { container } = await renderPostPage([
      {
        id: 1,
        commentBody: 'Hello world',
        userName: 'CommentAuthor',
        likes: 0,
      },
    ]);

    expect(await screen.findByText('CommentAuthor')).toBeInTheDocument();
    expect(container.querySelector('.commentItem .postAvatar')).toHaveTextContent('C');
  });

  it('renders a legacy fallback when author data is missing', async () => {
    const { container } = await renderPostPage([
      {
        id: 2,
        commentBody: 'Older comment',
        userName: null,
        likes: 1,
      },
    ]);

    expect(await screen.findByText('Unknown user')).toBeInTheDocument();
    expect(container.querySelector('.commentItem .postAvatar')).toHaveTextContent('?');
  });
});
