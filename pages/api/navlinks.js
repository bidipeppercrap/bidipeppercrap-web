import { supabase } from "@/utils/supabaseClient"

export default async (req, res) => {
  const staticlinks = [
    {
        path: '/contacts',
        name: 'contacts'
    },
    {
      path: '/posts/1',
      name: 'posts'
    },
    {
        path: '/',
        name: 'home'
    },
  ]

  const { data: categories } = await supabase.from('categories').select('id, displayed_name')

  const navlinks = categories.map(category => ({ path: `/categories/${category.id}/1`, name: category.displayed_name }))

  staticlinks.forEach(link => navlinks.unshift(link))

  res.status(200).json(navlinks)
}
