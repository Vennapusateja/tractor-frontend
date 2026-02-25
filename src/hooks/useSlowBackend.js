import { useState, useEffect } from 'react';

/**
 * Returns true when `isLoading` has been true for more than `delayMs` ms.
 * Use this to show a "backend is waking up" warning on slow first requests.
 */
export default function useSlowBackend(isLoading, delayMs = 5000) {
    const [slow, setSlow] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setSlow(false);
            return;
        }
        const timer = setTimeout(() => setSlow(true), delayMs);
        return () => clearTimeout(timer);
    }, [isLoading, delayMs]);

    return slow;
}
