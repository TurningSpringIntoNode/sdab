--Signatures
sig Anime{
	episodios: set Episode,
	name: one AnimeName,
	resume: one Resume
}

sig Genre{
	animes: set Anime
}

sig Episode{
	name: one EpisodeName,
	description: one Description,
	chapter: one Int
}

sig AnimeName{}
sig Resume{}
sig EpisodeName{}
sig Description{}
sig UserName{}
sig Email{}
sig Password{}

abstract sig Role{}

one sig Admin extends Role{}
one sig Comum extends Role{}

sig User{
	role: one Role,
	name: one UserName,
	email: one Email,
	password: one Password,
	
}



--Facts
fact{
	all a:Anime| a in Genre.animes
	all e: Episode | one a:Anime | e in a.episodios
	one u:User | u.role = Admin
	all an:AnimeName| one a:Anime | an in a.name
	all r:Resume | one a:Anime | r in a.resume
	all en:EpisodeName| one e:Episode| en in e.name
	all d:Description| one e:Episode|d in e.description
	all a:Anime| all e1:Episode|all e2:Episode| e1 != e2
	and e1 in a.episodios and e2 in a.episodios =>
	e1.chapter != e2. chapter
	all un:UserName| un in User.name
	all e:Email | one u:User | e in u.email
	all p:Password | p in User.password
}

--Predicates
pred adicionaEpisodio[a,a':Anime,u:User, e:Episode]{
	(u.role = Admin and a'.episodios = a.episodios + e)


}

--Functions
fun getEpisodios[a:Anime]: set Episode{
	a.episodios
}

fun getAnimes[g:Genre]: set Anime{
	g.animes
}


assert todoAnimeTemGenero{
	all a:Anime | some g:Genre | a in g.animes
}

run {} for 2
