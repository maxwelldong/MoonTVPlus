'use client';

import { History } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { getAllMangaReadRecords } from '@/lib/db.client';
import { MangaReadRecord } from '@/lib/manga.types';

import MangaCard from '@/components/MangaCard';

function MangaHistorySkeleton() {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6'>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950'>
          <div className='aspect-[3/4] w-full animate-pulse bg-gray-200 dark:bg-gray-800' />
          <div className='space-y-3 p-3'>
            <div className='h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800' />
            <div className='h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800' />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MangaHistoryPage() {
  const [history, setHistory] = useState<Record<string, MangaReadRecord>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMangaReadRecords()
      .then(setHistory)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const historyList = useMemo(
    () => Object.entries(history).sort(([, a], [, b]) => b.saveTime - a.saveTime),
    [history]
  );

  return (
    <section className='mx-auto max-w-6xl'>
      <div className='mb-4 flex items-center gap-2 text-sm text-gray-500'>
        <History className='h-4 w-4 text-violet-500' /> 共 {historyList.length} 条阅读记录
      </div>
      {loading ? (
        <MangaHistorySkeleton />
      ) : historyList.length === 0 ? (
        <div className='rounded-2xl bg-gray-50 p-10 text-center text-sm text-gray-500 dark:bg-gray-900/50'>
          暂无阅读历史
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6'>
          {historyList.map(([key, item]) => (
            <MangaCard
              key={key}
              item={item}
              href={`/manga/read?mangaId=${item.mangaId}&sourceId=${item.sourceId}&chapterId=${item.chapterId}&title=${encodeURIComponent(item.title)}&cover=${encodeURIComponent(item.cover)}&sourceName=${encodeURIComponent(item.sourceName)}&chapterName=${encodeURIComponent(item.chapterName)}`}
              subtitle={`${item.chapterName} · 第 ${item.pageIndex + 1}/${item.pageCount} 页`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
