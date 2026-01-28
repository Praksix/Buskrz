import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface LikeButtonProps {
    concertId: string
    initialIsLiked?: boolean
    onToggle?: (newIsLiked: boolean) => void
    disabled?: boolean
}

const LikeButton: React.FC<LikeButtonProps> = ({ concertId, initialIsLiked = false, onToggle, disabled }) => {
    const { user, isAuthenticated } = useAuth()
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLiked(initialIsLiked)
    }, [initialIsLiked])

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering card clicks

        console.log('LikeButton clicked', { concertId, isLiked, userId: user?.id })

        if (!isAuthenticated || !user) {
            console.warn("User must be logged in to like.")
            return
        }

        if (isLoading || disabled) return

        const userId = user.id
        const originalState = isLiked
        // Optimistic update
        const newState = !isLiked
        setIsLiked(newState)
        setIsLoading(true)

        try {
            const method = newState ? 'POST' : 'DELETE'
            const url = `http://localhost:8080/api/v1/users/${userId}/concerts/${concertId}/like`
            console.log(`Sending ${method} request to ${url}`)

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            console.log('API Response status:', response.status)

            if (!response.ok) {
                const text = await response.text()
                throw new Error(`Failed to update like status: ${response.status} - ${text}`)
            }

            if (onToggle) {
                onToggle(newState)
            }
        } catch (error) {
            console.error('Error updating like status:', error)
            // Revert on error
            setIsLiked(originalState)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated) return null // Hide if not logged in (per plan, or show empty disabled heart)

    return (
        <button
            onClick={handleClick}
            disabled={isLoading || disabled}
            className={`group relative flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
            title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            {/* Heart Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isLiked ? "#CE5526" : "none"} // Brand color or white? Using brand color for filled.
                stroke={isLiked ? "#CE5526" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-6 h-6 transition-colors duration-300 ${isLiked ? 'text-[#CE5526]' : 'text-white/60 group-hover:text-[#CE5526]'}`}
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>
    )
}

export default LikeButton
