import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePageContent } from './app/(home)/content';
import { ChatPageContent } from './app/chat/content';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePageContent />,
    },
    {
        path: '/chat',
        element: <ChatPageContent />,
    },
]);

export default function App() {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}
