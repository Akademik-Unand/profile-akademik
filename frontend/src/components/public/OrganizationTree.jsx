export function OrganizationTree({ members = [] }) {
  if (!members.length) return <p className="text-sm text-neutral-600">Struktur organisasi belum dipublikasikan.</p>;

  return (
    <div className="space-y-8">
      {members.map((member) => (
        <OrganizationCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function OrganizationCard({ member }) {
  const photo = member.photo?.url;

  return (
    <article>
      <div className="flex gap-4">
        {photo ? (
          <img src={photo} alt="" className="h-24 w-24 rounded-md object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-mist text-sm text-primary">
            {member.name?.slice(0, 2)}
          </div>
        )}
        <div>
          <h2 className="font-headline text-lg text-neutral-900">{member.name}</h2>
          <p className="mt-1 text-sm text-neutral-600">{member.title}</p>
        </div>
      </div>
      {member.children?.length ? (
        <div className="mt-6 grid gap-4 border-l border-neutral-200 pl-6 sm:grid-cols-2">
          {member.children.map((child) => (
            <OrganizationCard key={child.id} member={child} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
