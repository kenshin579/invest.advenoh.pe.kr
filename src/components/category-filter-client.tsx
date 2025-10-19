'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Category {
  category: string;
  count: number;
}

interface CategoryFilterClientProps {
  categories: Category[];
  selectedCategory?: string;
  searchTerm?: string;
  selectedTags?: string[];
}

export function CategoryFilterClient({
  categories,
  selectedCategory = 'all',
  searchTerm = '',
  selectedTags = []
}: CategoryFilterClientProps) {
  const router = useRouter()

  const allCategories = [
    { id: "all", label: "전체" },
    ...(Array.isArray(categories) ? categories.map(({ category }) => ({
      id: category,
      label: category
    })) : [])
  ]

  const handleCategoryChange = (category: string) => {
    // URL 파라미터 구성
    const params = new URLSearchParams()
    if (category !== 'all') {
      params.set('category', category)
    }
    if (searchTerm) {
      params.set('search', searchTerm)
    }
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags[0])
    }

    // 클라이언트 사이드 네비게이션 (페이지 리로드 없음)
    const url = params.toString() ? `/?${params.toString()}` : '/'
    router.push(url)
  }

  return (
    <section className="bg-background py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3">
          {allCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`category-filter px-6 py-2 rounded-full font-medium ${
                selectedCategory === category.id 
                  ? "active bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted"
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}