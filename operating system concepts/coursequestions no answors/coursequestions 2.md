# Course Questions - Lecture 2

## What are containers?
>

## Why would anyone use containers? Aka. what is the prime goal/function of containers?
>

## What is the difference between a container and a virtual machine?
>

## Why are the terms "container" and "docker" not synonyms?
>

## List 2 other technologies to run a "container" without using "docker"
>

## Is it possible to run the very same type of Docker container both on Linux and on Windows? Why or why not? How do Windows 10 and Windows 11 work around this?
>

## What is the difference between the Docker client (utilities) and the Docker server (~daemon)?
>

## What is a Dockerfile?
>

## What is a Docker image?
>

## What is a Docker registry?
>

## What do the following docker commands do?

- `docker ps`
>
- `docker images`
>
- `docker run -d <imagename>`
>
- `docker exec -it <imagename> sh`
>
- `docker compose up`
>
- `docker stop <containerid>`
>
- `docker rm <containerid>`
>

## What is the workflow (--> you should be able to do this yourself!) to properly deploy/ship/package an application

- Create an application that prints "hello world" in a programming language.
- Create a Dockerfile for this application
- Build a Docker image from this Dockerfile
- Create and run a Docker container from this Docker image
- Interact with the container by entering (and gaining access with for example a shell) to the running Docker container
- Stop and remove the Docker container.
