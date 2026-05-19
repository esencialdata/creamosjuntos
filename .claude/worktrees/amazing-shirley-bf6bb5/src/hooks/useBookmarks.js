import { useState, useEffect } from 'react';
import { subscribeToUserBookmarks, saveBookmark, removeBookmark } from '../services/firestoreService';
import { getDeviceID } from '../utils/identity';

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState({});
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        const id = getDeviceID();
        setDeviceId(id);

        const unsubscribe = subscribeToUserBookmarks(id, (data) => {
            setBookmarks(data);
        });

        return () => unsubscribe();
    }, []);

    const isBookmarked = (itemId) => {
        return !!bookmarks[itemId];
    };

    const toggleBookmark = async (item) => {
        if (!deviceId) return;

        const itemId = item.itemID;
        if (isBookmarked(itemId)) {
            await removeBookmark(deviceId, itemId);
        } else {
            await saveBookmark(deviceId, item);
        }
    };

    return {
        isBookmarked,
        toggleBookmark,
        bookmarks
    };
};
