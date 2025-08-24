'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  X
} from 'lucide-react'
import { formatDate } from '@/app/lib/utils'
import { useSession } from 'next-auth/react'

interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  author: {
    id: string
    name: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AnnouncementsPage() {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isActive: true
  })

  const isMember = session?.user?.role === 'MEMBER'

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        // For members, only show active announcements
        const filteredData = isMember ? data.filter((a: Announcement) => a.isActive) : data
        setAnnouncements(filteredData)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAnnouncement 
        ? `/api/announcements/${editingAnnouncement.id}`
        : '/api/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowModal(false)
        setEditingAnnouncement(null)
        setFormData({ title: '', content: '', isActive: true })
        fetchAnnouncements()
        alert(editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!')
      } else {
        alert('Error saving announcement')
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
      alert('Error saving announcement')
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isActive: announcement.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAnnouncements()
        alert('Announcement deleted successfully!')
      } else {
        alert('Error deleting announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Error deleting announcement')
    }
  }

  const handleToggleStatus = async (announcement: Announcement) => {
    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...announcement,
          isActive: !announcement.isActive
        }),
      })

      if (response.ok) {
        fetchAnnouncements()
        alert(`Announcement ${announcement.isActive ? 'deactivated' : 'activated'} successfully!`)
      } else {
        alert('Error updating announcement status')
      }
    } catch (error) {
      console.error('Error updating announcement status:', error)
      alert('Error updating announcement status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Megaphone className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-300">Loading announcements...</p>
        </div>
      </div>
    )
  }

  // Member View - Read-only announcements
  if (isMember) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Gym Announcements</h1>
          <p className="text-gray-300">Stay updated with the latest gym news and updates</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{announcement.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      Posted by {announcement.author.name} on {formatDate(new Date(announcement.createdAt))}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.isActive 
                        ? 'bg-green-900 text-green-400' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-200 whitespace-pre-wrap">{announcement.content}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Posted: {formatDate(new Date(announcement.createdAt))}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{announcement.author.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {announcements.length === 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No announcements</h3>
                <p className="text-gray-300">
                  There are no active announcements at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Admin/Staff View - Full announcement management
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
          <p className="text-gray-300">Manage gym announcements and updates</p>
        </div>
        <Button
          onClick={() => {
            setEditingAnnouncement(null)
            setFormData({ title: '', content: '', isActive: true })
            setShowModal(true)
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{announcement.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Posted by {announcement.author.name} on {formatDate(new Date(announcement.createdAt))}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    announcement.isActive 
                      ? 'bg-green-900 text-green-400' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {announcement.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap line-clamp-3">{announcement.content}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(new Date(announcement.createdAt))}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleToggleStatus(announcement)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {announcement.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(announcement)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(announcement.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No announcements</h3>
            <p className="text-gray-300 mb-4">
              Get started by creating your first announcement.
            </p>
            <Button
              onClick={() => {
                setEditingAnnouncement(null)
                setFormData({ title: '', content: '', isActive: true })
                setShowModal(true)
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Announcement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter announcement title"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter announcement content"
                    required
                    rows={6}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-300">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
