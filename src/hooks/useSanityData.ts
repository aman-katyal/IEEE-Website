import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'
import groq from 'groq'
import type { Committee, CornerstoneCommittee } from '../data/committees/types'

export function useCommittees() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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

    client.fetch(query)
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

  useEffect(() => {
    const query = groq`*[_type == "committee" && id.current == $id][0]{
      ...,
      "id": id.current,
      "image": image.asset->url,
      sections[]{
        ...,
        "image": image.asset->url,
        items[]{
          ...,
          "image": image.asset->url
        }
      }
    }`

    client.fetch(query, { id })
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

  useEffect(() => {
    const query = groq`*[_type == "cornerstone"]{
      ...,
      "id": id.current
    }`

    client.fetch(query)
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

  useEffect(() => {
    const query = groq`*[_type == "leader"] | order(order asc){
      ...,
      "image": coalesce(image.asset->url, image)
    }`

    client.fetch(query)
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
