import { useState } from "react"
import "./App.css"

function App() {
  const [username, setUsername] = useState("")
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const findUser = async () => {
    if (!username.trim()) {
      setError("Enter a GitHub username")
      return
    }

    setLoading(true)
    setError("")

    try {
      const user = await fetch(`https://api.github.com/users/${username}`)
      if (!user.ok) throw new Error("User not found")

      const data = await user.json()
      const repo = await fetch(`https://api.github.com/users/${username}/repos`)
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

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <header>
        <h1>GitHub Analyzer</h1>
        <p>Explore GitHub profiles and repositories</p>
      </header>

      <main>
        <section className="search">
          <h2>Find a GitHub Profile</h2>
          <div className="search-box">
            <input
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button onClick={findUser}>Search</button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
        </section>

        {profile && (
          <>
            <section className="profile">
              <img src={profile.avatar_url} alt={profile.login} />
              <div>
                <h2>{profile.name || profile.login}</h2>
                <p>@{profile.login}</p>
                <p>{profile.bio || "No bio available"}</p>
                <div className="stats">
                  <span>Followers: {profile.followers}</span>
                  <span>Following: {profile.following}</span>
                  <span>Repos: {profile.public_repos}</span>
                </div>
              </div>
            </section>

            <section>
              <div className="repo-head">
                <h2>Repositories</h2>
                <input
                  placeholder="Search repositories"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="repos">
                {filteredRepos.map(repo => (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo"
                    key={repo.id}
                  >
                    <h3>{repo.name}</h3>
                    <p>{repo.description || "No description"}</p>
                    <span>⭐ {repo.stargazers_count}</span>
                    <span> {repo.language || "No language"}</span>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App