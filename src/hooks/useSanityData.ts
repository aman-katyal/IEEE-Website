import { useState, useEffect } from 'react'
import { client, previewClient } from '../lib/sanity'
import groq from 'groq'
import type { Committee, CornerstoneCommittee } from '../data/committees/types'

// Simple helper to detect if we should use the preview client
const usePreview = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('preview') || window.location.hostname.includes('sanity.studio') || window.self !== window.top;
};

export function useCommittees() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isPreview = usePreview();
  const activeClient = isPreview ? previewClient : client;

  useEffect(() => {
    const query = groq`*[_type == "committee"]{
      ...,
      "id": id.current,
      "image": coalesce(image.asset->url, image),
      sections[]{
        ...,
        "image": coalesce(image.asset->url, image),
        items[]{
          ...,
          "image": coalesce(image.asset->url, image)
        }
      }
    }`

    activeClient.fetch(query)
      .then(data => {
        setCommittees(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { committees, loading, error }
}

export function useCommittee(id: string) {
  const [committee, setCommittee] = useState<Committee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isPreview = usePreview();
  const activeClient = isPreview ? previewClient : client;

  useEffect(() => {
    const query = groq`*[_type == "committee" && id.current == $id][0]{
      ...,
      "id": id.current,
      "image": coalesce(image.asset->url, image),
      sections[]{
        ...,
        "image": coalesce(image.asset->url, image),
        items[]{
          ...,
          "image": coalesce(image.asset->url, image)
        }
      }
    }`

    activeClient.fetch(query, { id })
      .then(data => {
        setCommittee(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [id])

  return { committee, loading, error }
}

export function useCornerstoneCommittees() {
  const [committees, setCommittees] = useState<CornerstoneCommittee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isPreview = usePreview();
  const activeClient = isPreview ? previewClient : client;

  useEffect(() => {
    const query = groq`*[_type == "cornerstone"]{
      ...,
      "id": id.current
    }`

    activeClient.fetch(query)
      .then(data => {
        setCommittees(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { committees, loading, error }
}

export function useLeaders() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isPreview = usePreview();
  const activeClient = isPreview ? previewClient : client;

  useEffect(() => {
    const query = groq`*[_type == "leader"] | order(order asc){
      ...,
      "image": coalesce(image.asset->url, image)
    }`

    activeClient.fetch(query)
      .then(data => {
        setLeaders(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { leaders, loading, error }
}
