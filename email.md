# Mandrill template draft: nx-cloud-plan-add-on-requested

For Jack to create + publish in Mandrill (mandrillapp.com, mailchimp login). Code references the slug only; subject and from fields live in the Mandrill template manager (Kotlin sends them empty, same as the other add-on emails).

## Template settings

- **Template name / slug:** `nx-cloud-plan-add-on-requested`
- **From address:** `cloud-support@nrwl.io`
- **From name:** `Nx Cloud`
- **Subject:** `*|USER_NAME|* requested the *|ADD_ON_NAME|* add-on for *|ORGANIZATION_NAME|*`

## Merge variables (sent per recipient by nx-api `PlanAddOnNotificationService.notifyMemberRequested`)

| Variable | Content |
| --- | --- |
| `ORGANIZATION_NAME` | Org display name |
| `ADD_ON_NAME` | Add-on display name, e.g. `Sandboxing` |
| `ADD_ON_LINK` | `https://cloud.nx.app/orgs/<orgId>/add-ons` |
| `USER_NAME` | Requesting member's name |
| `USER_EMAIL` | Requesting member's email |

## Body (HTML)

```html
<p>Hi,</p>

<p>
  <strong>*|USER_NAME|*</strong> (*|USER_EMAIL|*) asked to enable the
  <strong>*|ADD_ON_NAME|*</strong> add-on for the
  <strong>*|ORGANIZATION_NAME|*</strong> organization on Nx Cloud.
</p>

<p>
  You are receiving this because you are an admin of *|ORGANIZATION_NAME|*.
  Enabling an add-on applies to the whole organization.
</p>

<p>
  <a href="*|ADD_ON_LINK|*">Review add-ons</a>
</p>

<p>
  If the link does not work, copy this URL into your browser:<br />
  *|ADD_ON_LINK|*
</p>

<p>The Nx Cloud team</p>
```

## Plain-text part

```
Hi,

*|USER_NAME|* (*|USER_EMAIL|*) asked to enable the *|ADD_ON_NAME|* add-on for the *|ORGANIZATION_NAME|* organization on Nx Cloud.

You are receiving this because you are an admin of *|ORGANIZATION_NAME|*. Enabling an add-on applies to the whole organization.

Review add-ons: *|ADD_ON_LINK|*

The Nx Cloud team
```

