import { useState } from "react"
import "./App.css"

function App() {
  const [username,setUsername] = useState("")
  const [profile,setProfile] = useState(null)
  const [repos,setRepos] = useState([])
  const [search,setSearch] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const findUser = async () => {
    if (!username.trim()) {
      setError("Enter a GitHub username")
      return
    }
    setLoading(true)
    setError("")
    try {
      const user = await fetch(`https://api.github.com/users/${username.trim()}`)
      if (!user.ok) throw new Error("User not found")
      const data = await user.json()
      const repo = await fetch(`https://api.github.com/users/${username.trim()}/repos?per_page=30&sort=updated`)
      const repoData = await repo.json()
      setProfile(data)
      setRepos(repoData)
    } catch (err) {
      setError(err.message)
      setProfile(null)
      setRepos([])
    }
    setLoading(false)
  }

  const filteredRepos = repos.filter(repo => repo.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app">
      <header>
        <h1>GitHub Analyzer</h1>
        <p>Developer profile insights</p>
      </header>
      <main>
        <section className="hero">
          <span className="badge">GITHUB DEVELOPER TOOL</span>
          <h2>Understand any GitHub profile.</h2>
          <p>Search public profiles, explore repositories and discover developer activity in seconds.</p>
          <div className="search-box">
            <input placeholder="Enter GitHub username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && findUser()} />
            <button onClick={findUser}>Search Profile</button>
          </div>
          <small>Public GitHub data · No login required</small>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
        </section>

        {!profile && (
          <div className="features">
            <div><b>01</b><h3>Profile Insights</h3><p>View followers, repositories and profile information.</p></div>
            <div><b>02</b><h3>Repository Explorer</h3><p>Explore public projects, stars and languages.</p></div>
            <div><b>03</b><h3>Quick Search</h3><p>Find repositories instantly with simple filtering.</p></div>
          </div>
        )}

        {profile && (
          <>
            <section className="profile">
              <img src={profile.avatar_url} alt={profile.login} />
              <div>
                <h2>{profile.name || profile.login}</h2>
                <p>@{profile.login}</p>
                <p>{profile.bio || "No bio available"}</p>
                <div className="stats">
                  <span>{profile.followers} Followers</span>
                  <span>{profile.following} Following</span>
                  <span>{profile.public_repos} Repositories</span>
                </div>
              </div>
            </section>
            <div className="repo-head">
              <div><h2>Repositories</h2><p>Public projects from this profile</p></div>
              <input placeholder="Search repositories" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="repos">
              {filteredRepos.map(repo => (
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo" key={repo.id}>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || "No description"}</p>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>{repo.language || "No language"}</span>
                </a>
              ))}
              {!filteredRepos.length && <p>No repositories found.</p>}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App