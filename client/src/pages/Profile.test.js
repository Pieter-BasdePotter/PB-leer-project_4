import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import axios from '../api/axios';

jest.mock('../api/axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ username: 'LoggedInUser' }),
}));

const ALICE_PROFILE = {
    user: { id: 2, username: 'alice', createdAt: '2025-01-01T00:00:00.000Z' },
    posts: [
        { id: 10, title: 'Alice post 1', postText: 'Hello world', userName: 'alice', createdAt: '2026-01-01T00:00:00.000Z', likes: 3 },
        { id: 11, title: 'Alice post 2', postText: 'Another post', userName: 'alice', createdAt: '2026-02-01T00:00:00.000Z', likes: 0 },
    ],
    followerCount: 5,
    followingCount: 2,
    isFollowing: false,
};

const OWN_PROFILE = {
    ...ALICE_PROFILE,
    user: { id: 1, username: 'LoggedInUser', createdAt: '2025-01-01T00:00:00.000Z' },
    posts: [
        { id: 20, title: 'My post', postText: 'My content', userName: 'LoggedInUser', createdAt: '2026-01-01T00:00:00.000Z', likes: 1 },
    ],
    isFollowing: false,
};

const renderProfilePage = (username, profileData) => {
    axios.get.mockResolvedValue({ data: profileData });
    return render(
        <MemoryRouter initialEntries={[`/profile/${username}`]}>
            <Routes>
                <Route path="/profile/:username" element={<Profile />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('Profile page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders profile header with username', async () => {
        renderProfilePage('alice', ALICE_PROFILE);
        expect(await screen.findByText('alice')).toBeInTheDocument();
    });

    it('shows all posts authored by the profile user', async () => {
        renderProfilePage('alice', ALICE_PROFILE);
        expect(await screen.findByText('Alice post 1')).toBeInTheDocument();
        expect(screen.getByText('Alice post 2')).toBeInTheDocument();
    });

    it('shows follower and following counts', async () => {
        renderProfilePage('alice', ALICE_PROFILE);
        await screen.findByText('alice');
        expect(screen.getByText('5')).toBeInTheDocument(); // followerCount
        expect(screen.getByText('2')).toBeInTheDocument(); // followingCount
    });

    it('shows Follow button when viewing another user\'s profile', async () => {
        renderProfilePage('alice', ALICE_PROFILE);
        const btn = await screen.findByRole('button', { name: /follow/i });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();
    });

    it('hides Follow button when viewing own profile', async () => {
        renderProfilePage('LoggedInUser', OWN_PROFILE);
        await screen.findByText('LoggedInUser');
        expect(screen.queryByRole('button', { name: /follow/i })).not.toBeInTheDocument();
    });

    it('shows "Following" when isFollowing is true', async () => {
        const followingProfile = { ...ALICE_PROFILE, isFollowing: true };
        renderProfilePage('alice', followingProfile);
        expect(await screen.findByRole('button', { name: /following/i })).toBeInTheDocument();
    });

    it('clicking Follow calls POST /profile/:username/follow and updates button state', async () => {
        axios.post.mockResolvedValue({ data: { following: true, followerCount: 6 } });
        renderProfilePage('alice', ALICE_PROFILE);

        const btn = await screen.findByRole('button', { name: /^\+ follow$/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/profile/alice/follow');
        });

        expect(await screen.findByRole('button', { name: /following/i })).toBeInTheDocument();
    });

    it('shows "No posts yet." when user has no posts', async () => {
        const emptyProfile = { ...ALICE_PROFILE, posts: [] };
        renderProfilePage('alice', emptyProfile);
        expect(await screen.findByText('No posts yet.')).toBeInTheDocument();
    });

    it('shows error state when profile is not found', async () => {
        axios.get.mockRejectedValue({ response: { status: 404 } });
        render(
            <MemoryRouter initialEntries={['/profile/nobody']}>
                <Routes>
                    <Route path="/profile/:username" element={<Profile />} />
                </Routes>
            </MemoryRouter>
        );
        expect(await screen.findByText('User not found.')).toBeInTheDocument();
    });
});
