export interface Links {
  next: string
  previous: string
}

export interface Sizes {
  thumb_24: string
  thumb_256: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  username: string,
  meta: {
    coloring: {
      current?: string,
      editor?: string
    }
  }
}

export interface Comment {
  user: User
  content: string
}

export interface ResponseComment {
  instance: any
  properties: any[]
  links: Links
  count: number
  page_size: number
  num_pages: number
  results: Comment[]
}

export interface Topic {
  id: number
  meta: any
  updated: string
  created: string
  db_status: number
  name: string
  id_string: string
  desc: string
  is_featured: boolean
  is_verified: boolean
  score: number
  user: User
  media: any
  taxonomies: Taxonomy[]
}

export interface Taxonomy {
  type: string
  id_string: string
  name: string
  updated: string
}

export interface ResponseTopic {
  instance: any
  properties: any[]
  links: Links
  count: number
  page_size: number
  num_pages: number
  results: Topic[]
}


export interface ResponseTaxonomy {
  instance: any
  properties: any[]
  links: Links
  count: number
  page_size: number
  num_pages: number
  results: Taxonomy[]
}


export interface Post {
  id?: number
  meta?: any
  updated?: string
  created?: string
  db_status?: number
  name: string
  id_string: string
  desc: any
  text: string
  parent: number
  contrib?: any
  topic: number
  user: number
  children?: Post[]
  expanded?: boolean
}

export interface ResponsePost {
  instance: Topic
  properties: any[]
  links: Links
  count: number
  page_size: number
  num_pages: number
  results: Post[]
}

export interface IBreadcrumb {
  name: string
  href: string
  current: boolean
}
