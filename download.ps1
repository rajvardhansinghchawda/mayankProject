$urls = @{
    "desktop_dashboard.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzkyNGZmNDIwNWM2NTRlNzdhMjM1NGFkZjgxZjkyZGMxEgsSBxDeydqkgRMYAZIBIwoKcHJvamVjdF9pZBIVQhM5MzAyODg2MTYzOTc2MDI5NjEy&filename=&opi=89354086"
    "desktop_profile.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Q1ODJmOTM2ZTEwMDQ2ZDE5ZWI2MmUxN2VjZGE3ZjRiEgsSBxDeydqkgRMYAZIBIwoKcHJvamVjdF9pZBIVQhM5MzAyODg2MTYzOTc2MDI5NjEy&filename=&opi=89354086"
    "desktop_login.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY0ZWE4MGJhZjM4M2YwNWMyZmY0NTI0MTFlYmI2EgsSBxDeydqkgRMYAZIBIwoKcHJvamVjdF9pZBIVQhM5MzAyODg2MTYzOTc2MDI5NjEy&filename=&opi=89354086"
    "mobile_dashboard.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZiNzA5N2RmZGE4YTQ0NzBiOWVkNzNkOTM0YTg3MGEwEgsSBxDeydqkgRMYAZIBIwoKcHJvamVjdF9pZBIVQhM5MzAyODg2MTYzOTc2MDI5NjEy&filename=&opi=89354086"
    "mobile_login.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2IwYmMwOWNhOWE4ZjQwNGM4MDc0ZmFlNzYwZjI1YTRhEgsSBxDeydqkgRMYAZIBIwoKcHJvamVjdF9pZBIVQhM5MzAyODg2MTYzOTc2MDI5NjEy&filename=&opi=89354086"
}

New-Item -ItemType Directory -Force -Path "_stitch"

foreach ($key in $urls.Keys) {
    Invoke-WebRequest -Uri $urls[$key] -OutFile "_stitch\$key"
}
