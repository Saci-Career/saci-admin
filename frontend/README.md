# Saci Client

This project is a result of a partnership between Escola Profissional Bento de Jesus Caraça and Kuehne+Nagel. It was developed by intern students (check the contributors)

Saci is an application that allows users to evaluate themselves in some knowledges, according to a choosen role. Let's suppose we have a company called ACME. ACME has as roles: clerks, programmers and managers. Each one of these roles has its own levels. So a manager can be an entry level manager, a mid level manager, or an advanced manager for example. How does an ACME manager know his/her level? How does a manager know what he/she needs to do, to get to the next level?

Saci creates a mechanism, where ACME career managers can create roles, knowledges and role levels, allowing ACME workers to assess themselves. With this assessment, they can know in what level they are (for their roles) and what they need to do to achieve the next level.

This repository is the frontend project for Saci administration, that means, it offers mechanisms and screens for roles, levels and knowledges management. The following diagram shows how each of these entities relate to each other:

<img width="284" alt="image" src="https://github.com/Saci-Career/saci-admin/assets/16262664/5e2d5b35-bb5c-475c-9ae0-f72b21dd1d20">

- Role: role is the main entity in this project. Following the previous examples, roles would be clerks, programmers and managers
- Level: possible position a worker can be inside a role. Also in the previous example, a manager can be an entry level, a mid level or an advanced manager. These are levels
- Knowledge: knowledges attached to some role. A manager for example, should know somethings like risk management, scheduling and resource allocation. These are the knowledges attached to the role manager. Also, each knowledge has a weight, from 0 to 5, where as greater it is, more important that knowledge is for a given role. So, for example, in ACME it's more important for a manager to know resource allocation than risk management. In this case, resource allocation would have a greater score than risk management. This weight will be consider ahead, when we calculate the worker score

## How worker score is calculated?

The calculation of worker score is done through the following formula:

![image](https://github.com/Saci-Career/saci-admin/assets/16262664/114e67c8-45d6-46be-93f8-e150cd1e8df2)

This formula is composed by:
- Numerator: the summatory of all worker answers about their knowledge in some area, times the weight of that knowledge they answered
- Denominator: 5 (the maximum weight of a knowledge) times the summatory of all knowledge weights
- This division will always result in a number between 0 and 1. We multiply by 100 just to get a wider range, to do calculations about the worker level

## How worker is ranked

The worker will access our platform and will rank his/her independence for each knowledge his/her role has. If the worker answers 0, he/she doesn't know nothing about that knowledge. If he/she answers 5, he/she is a master in that knowledge. When the worker submits all his/her answers, the previous calculation is done, and a score is concluded. But what is done with this score? (from 0 to 100)

## Levels ranges

Each level of a role contains a minimum and maximum coefficients. When a worker of that role answers the quiz and receive a score, that score is compared to the levels of that role, and then returned to the user. An example? As I said before, ACME has three levels for its managers:

- Entry level: the coefficients goes from 0 to 30
- Mid level: the coefficients goes from 31 to 60
- Advanced manager: the coefficients goes from 61 to 100

If a worker receive a score of 50, the platform will return to the worker that he or she is a mid level manager, and also return his/her next level, containing a reference link containing what he or she needs to do/study to grow in his/her career

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
