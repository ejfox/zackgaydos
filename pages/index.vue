<template>
  <div class="max-w-2xl mx-auto p-4 space-y-8">
    <h1 class="text-4xl font-bold">Hi, I'm zack</h1>
    
    <!-- Posts container with staggered animation -->
    <div class="space-y-6">
      <TransitionGroup
        name="list"
        tag="div"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
      >
        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
        >
          <p class="text-gray-800 dark:text-gray-200 text-lg">{{ post.content }}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-sm text-gray-500">
              {{ new Date(post.created_at).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const posts = ref([])

// Fetch posts from Supabase
const fetchPosts = async () => {
  console.log('Fetching posts...')
  const { data, error } = await supabase
    .from('zackposts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return
  }

  console.log('Posts fetched:', data)
  posts.value = data
}

// Subscribe to realtime updates
const subscribeToUpdates = () => {
  supabase
    .channel('zackposts')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'zackposts' 
      }, 
      () => {
        fetchPosts()
      }
    )
    .subscribe()
}

onMounted(() => {
  fetchPosts()
  subscribeToUpdates()
})
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>